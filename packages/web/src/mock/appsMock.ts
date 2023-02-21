import { App } from '~/services/appsService'

const apps: Record<string, App> = {
  radarr: {
    id: 'radarr',
    type: 'app',
    description: 'Automate Movie downloads',
  },
  sonarr: {
    id: 'sonarr',
    type: 'app',
    description: 'Automate TV downloads',
  },
  airsonic: {
    id: 'airsonic',
    type: 'app',
    description: 'A music streaming server',
  },
  plex: { id: 'plex', type: 'service', description: 'Media streaming server' },
}

export const installedAppsMock: App[] = [apps.airsonic, apps.plex, apps.sonarr]

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

export const appUninstallMock = async (id: string): Promise<boolean> => {
  await new Promise((r) => setTimeout(() => r(''), 2000))
  installedAppsMock.splice(
    installedAppsMock.indexOf(
      installedAppsMock.find((app) => app.id === id) || ({} as App)
    ),
    1
  )
  return true
}

export const appInstallMock = async (id: string): Promise<boolean> => {
  await new Promise((r) => setTimeout(() => r(''), 10000))
  installedAppsMock.push(apps[id])
  return true
}

export const storeAppMock: App = apps.radarr

export const storeAppsMock: App[] = Object.values(apps)
