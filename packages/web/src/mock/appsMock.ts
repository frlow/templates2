import { InstalledApp, StoreApp } from '~/services/appsService'

export const installedAppsMock: InstalledApp[] = [
  {
    name: 'sonarr',
    type: 'app',
  },
  {
    name: 'airsonic',
    type: 'app',
  },
  { name: 'plex', type: 'service' },
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

export const appUninstallMock = async (): Promise<boolean> => {
  await new Promise((r) => setTimeout(() => r(''), 2000))
  return true
}

export const storeAppsMock: StoreApp[] = [
  {
    name: 'radarr',
  },
]
