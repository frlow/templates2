import { getSettings, Settings } from '~/services/settingsService'
import { ComposeSpecification, DefinitionsService } from './Compose'
import { getInstalledApps } from '~/services/appsService'
import { appDirectory } from '~/appDirectory'
import { execCommand } from '~/docker/exec'
import { AppConfig } from '~/docker/AppDirectory'
import * as fs from 'fs'
import YAML from 'yaml'

export const dockerLog = async (id: string, log: (msg: string) => void) => {
  const compose = await generateCompose()
  const settings = getSettings()
  const command = `docker compose -p ${settings.project} -f - logs ${id}`
  await execCommand(`echo '${JSON.stringify(compose)}' | ${command}`, log)
}

export const dockerInstall = async (log: (msg: string) => void) => {
  const compose = await generateCompose()
  const settings = getSettings()
  const base64 = Buffer.from(JSON.stringify(compose)).toString('base64')
  await execCommand(
    `docker run -v /var/run/docker.sock:/var/run/docker.sock -e COMPOSE=${base64} ${settings.image} sh -c 'echo $COMPOSE | base64 -d | docker compose -p ${settings.project} -f - up -d --remove-orphans'`,
    log
  )
}

export const dockerPull = async (log: (msg: string) => void) => {
  const compose = await generateCompose()
  const settings = getSettings()
  const command = `docker compose -p ${settings.project} -f - pull`
  await execCommand(`echo '${JSON.stringify(compose)}' | ${command}`, log)
}

const traefikService = (insecure: boolean): DefinitionsService => {
  const traefik = {
    image: 'traefik',
    ports: ['80:80', '443:443'],
    volumes: ['/var/run/docker.sock:/var/run/docker.sock', 'traefik:/data'],
    restart: 'always',
    command: [
      '--providers.docker=true',
      '--providers.docker.exposedByDefault=false',
      '--api.insecure=true',
      '--log.level=DEBUG',
      '--entrypoints.web.address=:80',
      '--serverstransport.insecureskipverify=true',
    ],
  }
  if (!insecure)
    traefik.command.push(
      ...[
        '--entrypoints.websecure.address=:443',
        '--entrypoints.web.http.redirections.entryPoint.to=websecure',
        '--certificatesresolvers.default.acme.tlsChallenge=true',
        '--certificatesresolvers.default.acme.storage=/data/acme.json',
      ]
    )
  return traefik
}

const templatesService = (settings: Settings): DefinitionsService => {
  const service: DefinitionsService = {
    image: settings.image,
    volumes: [
      '/var/run/docker.sock:/var/run/docker.sock',
      'templates:/app/data',
    ],
    restart: 'always',
    environment: [
      `PASSWORD=${settings.password}`,
      `IMAGE=${settings.image}`,
      `DOMAIN=${settings.domain}`,
      `INSECURE=${settings.insecure}`,
      `USERNAME=${settings.username}`,
      `PROJECT=${settings.project}`,
    ],
    labels: [
      'traefik.enable=true',
      `traefik.http.routers.templates.rule=Host(\`${settings.domain}\`)`,
      `traefik.http.services.templates.loadbalancer.server.port=3000`,
      `traefik.http.routers.templates.service=templates`,
      `traefik.http.routers.templates.entrypoints=web${
        settings.insecure ? '' : 'secure'
      }`,
      'traefik.http.middlewares.templates.forwardauth.address=http://templates:3000/__login/q',
      'traefik.http.routers.templates.middlewares=templates@docker',
      'traefik.http.routers.auth.rule=PathPrefix(`/__login`)',
      'traefik.http.routers.auth.priority=1000',
      'traefik.http.services.auth.loadbalancer.server.port=3000',
      'traefik.http.routers.auth.service=auth',
      `traefik.http.routers.auth.entrypoints=web${
        settings.insecure ? '' : 'secure'
      }`,
    ],
  }
  if (!settings.insecure)
    (service!.labels as any).push(
      'traefik.http.routers.templates.tls.certresolver=default',
      'traefik.http.routers.auth.tls.certresolver=default'
    )
  return service
}

const replaceVariables = (
  service: DefinitionsService,
  variables: Record<string, string>
): DefinitionsService => {
  let str = JSON.stringify(service)
  Object.entries(variables).forEach(([key, value]) => {
    const regexp = new RegExp(`{{${key}}}`, 'g')
    str = str.replace(regexp, value)
  })
  return JSON.parse(str)
}

const applyIngress = (
  service: DefinitionsService,
  ingress: Ingress,
  settings: Settings
) => {
  if (!service.labels) service.labels = ['traefik.enable=true']
  ;(service.labels as string[]).push(
    ...[
      `traefik.http.routers.${ingress.service}-${ingress.domain}.rule=Host(\`${ingress.domain}.${settings.domain}\`)`,
      `traefik.http.services.${ingress.service}-${ingress.domain}.loadbalancer.server.port=${ingress.port}`,
      `traefik.http.routers.${ingress.service}-${ingress.domain}.service=${ingress.service}-${ingress.domain}`,
      `traefik.http.routers.${ingress.service}-${
        ingress.domain
      }.entrypoints=web${settings.insecure ? '' : 'secure'}`,
    ]
  )
  if (!settings.insecure)
    (service!.labels as any).push(
      `traefik.http.routers.${ingress.service}-${ingress.domain}.tls.certresolver=default`
    )
  if (!ingress.insecure)
    (service!.labels as any).push(
      ...[
        `traefik.http.middlewares.${ingress.service}-${ingress.domain}.forwardauth.address=http://templates:3000/__login/q`,
        `traefik.http.routers.${ingress.service}-${ingress.domain}.middlewares=${ingress.service}-${ingress.domain}@docker`,
      ]
    )
  if (ingress.protocol)
    (service!.labels as any).push(
      `traefik.http.services.${ingress.service}-${ingress.domain}.loadbalancer.server.scheme=${ingress.protocol}`
    )
  return service
}

const getAppConfig = (id: string): AppConfig =>
  JSON.parse(JSON.stringify(appDirectory[id]))

type Ingress = {
  domain: string
  port: number
  service: string
  insecure?: boolean
  protocol?: 'http' | 'https'
}
const generateCompose = async () => {
  const settings = getSettings()
  const installedApps = getInstalledApps()
  const installed = Object.entries(installedApps).flatMap(([id, variables]) => {
    const appConfig = getAppConfig(id)
    const services = appConfig.services
    const ingresses: Ingress[] = Object.entries(appConfig.ingresses || {}).map(
      ([id, value]) => {
        if (typeof value === 'number')
          return {
            domain: id,
            port: Math.abs(value),
            service: id,
            insecure: value < 0,
          }
        else
          return {
            domain: value.domain || id,
            port: value.port,
            service: id,
            insecure: !!value.insecure,
            protocol: value.protocol,
          }
      }
    )
    for (const ingress of ingresses) {
      const service = services[ingress.service]
      applyIngress(service, ingress, settings)
    }
    const ret = Object.entries(services)
    ret.forEach((r) => (r[1].restart = 'always'))
    const withVariables = ret.map(
      ([key, service]) =>
        [
          key,
          replaceVariables(service, {
            username: settings.username,
            password: settings.password,
            image: settings.image,
            domain: settings.domain,
            ...variables,
          }),
        ] as [string, DefinitionsService]
    )
    return withVariables
  })
  const traefik = applyIngress(
    traefikService(settings.insecure),
    { service: 'traefik', port: 8080, domain: 'traefik' },
    settings
  )
  installed.push(['traefik', traefik])
  installed.push(['templates', templatesService(settings)])
  const services = installed.reduce(
    (acc, [key, value]) => ({ ...acc, [key]: value }),
    {}
  )
  const volumes = installed.reduce((acc, [key, value]) => {
    value.volumes
      ?.filter((v) => !v.startsWith('/'))
      .map((v) => v.split(':')[0].trim())
      .forEach((nv) => (acc[nv] = {}))
    return acc
  }, {} as any)
  const compose: ComposeSpecification = {
    services,
    volumes,
  }
  fs.writeFileSync(
    './data/docker-compose.yaml',
    YAML.stringify(compose),
    'utf8'
  )
  return compose
}
