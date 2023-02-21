import { App } from '~/services/appsService'

export const apps: App[] = [
  {
    id: 'radarr',
    type: 'app',
    description: 'Automate Movie downloads',
    state: 'notInstalled',
  },
  {
    id: 'sonarr',
    type: 'app',
    description: 'Automate TV downloads',
    state: 'installed',
  },
  {
    id: 'airsonic',
    type: 'app',
    description: 'A music streaming server',
    state: 'installed',
  },
  {
    id: 'plex',
    type: 'service',
    description: 'Media streaming server',
    state: 'installed',
  },
]

export const appLogMock = () => {
  const responses = [
    `sdfoihsf
sdfoijsdiof
sjdofihjskdfl`,
    `3+4904834
å340+83
+50834w
5384+5834+p
958u7o39mgu75o0394`,
    `e8+v9muö24i0983u450vjm7349+87
4e5vj7459v8m
4s59y70sv34875908345`,
  ]
  return responses[Math.floor(Math.random() * responses.length)]
}

export const appsMock = () => apps

export const appUninstallMock = async (id: string): Promise<boolean> => {
  await new Promise((r) => setTimeout(() => r(''), 2000))
  const app = apps.find((app) => app.id === id)
  if (!app) return false
  app.state = 'notInstalled'
  return true
}

export const appInstallMock = async (id: string): Promise<boolean> => {
  await new Promise((r) => setTimeout(() => r(''), 10000))
  const app = apps.find((app) => app.id === id)
  if (!app) return false
  app.state = 'installed'
  return true
}
