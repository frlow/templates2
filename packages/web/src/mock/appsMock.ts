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

const getRandomString = () => (Math.random() + 1).toString(36).substring(2)
const log: string[] = []
let counter = 0
setInterval(() => {
  counter = (counter + 1) % 10
  const str = (getRandomString() + getRandomString()).substring(0, 10 + counter)
  log.push(str)
}, 200)

export const appLogMock = () => {
  return log.slice(-100).join('\n')
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

export const upgradeAppsMock = async (): Promise<void> => {
  await new Promise((r) => setTimeout(() => r(''), 10000))
}
