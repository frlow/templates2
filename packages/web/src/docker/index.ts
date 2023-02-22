import { getSettings, Settings } from '~/services/settingsService'
import { ComposeSpecification, DefinitionsService } from '~/docker/Compose'
import { getInstalledApps } from '~/services/appsService'
import { appDirectory } from '~/appDirectory'
import { execCommand } from '~/docker/exec'
import { AppConfig } from '~/docker/AppDirectory'
import * as fs from 'fs'
import YAML from 'yaml'

export type DockerActionOptions = {
  args?: string[]
}

export const dockerCommand = async (
  compose: ComposeSpecification,
  command: 'up' | 'pull' | 'logs',
  log: (msg: string) => void,
  options?: DockerActionOptions
) => {
  const dockerCommand = `docker compose --verbose -p templates2 -f - ${command} ${options?.args?.join(
    ' '
  )}`
  await execCommand(`echo '${JSON.stringify(compose)}' | ${dockerCommand}`, log)
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
        // "--certificatesresolvers.default.acme.email={{email}}",
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
    ],
    labels: [
      'traefik.enable=true',
      `traefik.http.routers.templates.rule=Host(\`${settings.domain}\`)`,
      `traefik.http.services.templates.loadbalancer.server.port=3000`,
      `traefik.http.routers.templates.service=templates`,
      `traefik.http.routers.templates.entrypoints=web${
        settings.insecure ? '' : 'secure'
      }`,
    ],
  }
  return service
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
      // `traefik.http.services.${ingress.service}-${ingress.domain}.loadbalancer.server.scheme=https`,
    ]
  )
  return service
}

const getAppConfig = (id: string): AppConfig =>
  JSON.parse(JSON.stringify(appDirectory[id]))

type Ingress = { domain: string; port: number; service: string }
export const generateCompose = async () => {
  const settings = getSettings()
  const installedApps = getInstalledApps()
  const installed = Object.entries(installedApps).flatMap(([id, variables]) => {
    const appConfig = getAppConfig(id)
    const services = appConfig.services
    const ingresses: Ingress[] = Object.entries(appConfig.ingresses || {}).map(
      ([id, value]) => {
        if (typeof value === 'number')
          return { domain: id, port: value, service: id }
        else
          return { domain: value.domain || id, port: value.port, service: id }
      }
    )
    for (const ingress of ingresses) {
      const service = services[ingress.service]
      applyIngress(service, ingress, settings)
    }
    const ret = Object.entries(services)
    ret.forEach((r) => (r[1].restart = 'always'))
    return ret
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
