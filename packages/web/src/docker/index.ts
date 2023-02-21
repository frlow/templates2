import { getSettings, Settings } from '~/services/settingsService'
import {
  ComposeSpecification,
  DefinitionsService,
  PropertiesServices,
} from '~/docker/Compose'
import { getInstalledApps } from '~/services/appsService'
import { appDirectory } from '~/appDirectory'
import { execCommand } from '~/docker/exec'

export type DockerActionOptions = {
  args?: string[]
}

export const dockerCommand = async (
  compose: ComposeSpecification,
  command: 'up' | 'pull' | 'log',
  log: (msg: string) => void,
  options?: DockerActionOptions
) => {
  await execCommand(
    `echo '${JSON.stringify(
      compose
    )}' | docker-compose -p templates2 -f - ${command} ${options?.args?.join(
      ' '
    )}`,
    log
  )
}

const traefikService: DefinitionsService = {
  image: 'traefik',
  ports: ['80:80', '443:443'],
  volumes: ['/var/run/docker.sock:/var/run/docker.sock', 'traefik:/data'],
  command: [
    '--providers.docker=true',
    '--providers.docker.exposedByDefault=false',
    '--api.insecure=true',
    '--log.level=DEBUG',
    '--entrypoints.web.address=:80',
    '--entrypoints.websecure.address=:443',
    '--entrypoints.web.http.redirections.entryPoint.to=websecure',
    '--certificatesresolvers.default.acme.tlsChallenge=true',
    // "--certificatesresolvers.default.acme.email={{email}}",
    '--certificatesresolvers.default.acme.storage=/data/acme.json',
    '--serverstransport.insecureskipverify=true',
  ],
}

export const generateCompose = async () => {
  const settings = getSettings()
  const installed = Object.entries(getInstalledApps()).flatMap(
    ([id, variables]) => {
      const appConfig = appDirectory[id]
      const services = appConfig.services
      const ingresses = Object.entries(appConfig.ingresses || {}).map(
        ([id, value]) => {
          if (typeof value === 'number')
            return { domain: id, port: value, service: id }
          else
            return { domain: value.domain || id, port: value.port, service: id }
        }
      )
      for (const ingress of ingresses) {
        const service = services[ingress.service]
        if (!service.labels) service.labels = ['traefik.enable=true']
        ;(service.labels as string[]).push(
          ...[
            `traefik.http.routers.${ingress.service}-${ingress.domain}.rule=Host(\`${ingress.domain}.${settings.domain}\`)`,
            `traefik.http.services.${ingress.service}-${ingress.domain}.loadbalancer.server.port=${ingress.port}`,
            `traefik.http.routers.${ingress.service}-${ingress.domain}.service=${ingress.service}-${ingress.domain}`,
            `traefik.http.routers.${ingress.service}-${ingress.domain}.entrypoints=websecure`,
            `traefik.http.services.${ingress.service}-${ingress.domain}.loadbalancer.server.scheme=https`,
          ]
        )
      }
      return Object.entries(services)
    }
  )
  installed.push(['traefik', traefikService])
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
  return compose
}
