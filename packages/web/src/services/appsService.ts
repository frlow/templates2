import process from 'process'
import {
  appInstallMock,
  appLogMock,
  appsMock,
  appUninstallMock,
} from '~/mock/appsMock'
import { appDirectory } from '~/appDirectory'
import * as fs from 'fs'
import { dockerCommand, generateCompose } from '~/docker'

export type AppType = 'app' | 'service'
export type AppState = 'installed' | 'notInstalled'
export type App = {
  id: string
  description: string
  type: AppType
  state: AppState
}

const notImplemented = (name: string) => `${name} is not implemented`
let busy = false
const runIfNotBusy = async (func: () => Promise<boolean>) => {
  if (busy) {
    debugger
    return false
  }
  busy = true
  const result = await func()
  busy = false
  return result
}

const installedAppsPath = './data/apps.json'
if (!fs.existsSync('./data')) fs.mkdirSync('./data')
export type InstalledApps = Record<string, Record<string, string>>

const saveInstalledApps = (apps: InstalledApps) =>
  fs.writeFileSync(installedAppsPath, JSON.stringify(apps), 'utf8')

export const getInstalledApps = (): InstalledApps => {
  if (!fs.existsSync(installedAppsPath)) saveInstalledApps({})
  return JSON.parse(fs.readFileSync(installedAppsPath, 'utf8'))
}

const addInstalledApp = (id: string, variables: Record<string, string>) => {
  const apps = getInstalledApps()
  apps[id] = variables
  saveInstalledApps(apps)
}

const removeInstalledApp = (id: string) => {
  const apps = getInstalledApps()
  delete apps[id]
  saveInstalledApps(apps)
}

async function loadApps(): Promise<App[]> {
  const installed = getInstalledApps()
  return Object.entries(appDirectory).map(([id, value]) => ({
    id,
    state: (installed[id] ? 'installed' : 'notInstalled') as AppState,
    description: value.description,
    type: (Object.keys(value.ingresses || {}).length || 0 > 0
      ? 'app'
      : 'service') as AppType,
  }))
}

let log = 'Log start\n'

function loadLog(): string {
  return log
}

async function loadAppLog(id: string): Promise<string> {
  if (!getInstalledApps()[id]) return ''
  const compose = await generateCompose()
  let appLog = ''
  await dockerCommand(compose, 'logs', (msg) => (appLog += msg), {
    args: [id],
  })
  return appLog
}

async function runUninstallApp(id: string): Promise<boolean> {
  removeInstalledApp(id)
  const compose = await generateCompose()
  await dockerCommand(compose, 'up', (msg) => (log += msg), {
    args: ['-d', '--remove-orphans'],
  })
  return true
}

async function runInstallApp(
  id: string,
  variables: Record<string, string>
): Promise<boolean> {
  addInstalledApp(id, variables)
  const compose = await generateCompose()
  await dockerCommand(compose, 'up', (msg) => (log += msg), {
    args: ['-d', '--remove-orphans'],
  })
  return true
}

export const getApps = async () =>
  process.env.MOCK !== 'true' ? await loadApps() : appsMock()

export const getAppLog = async (id: string): Promise<string> =>
  process.env.MOCK !== 'true' ? loadAppLog(id) : appLogMock()

export const uninstallApp = async (id: string) =>
  runIfNotBusy(async () =>
    process.env.MOCK !== 'true'
      ? await runUninstallApp(id)
      : await appUninstallMock(id)
  )

export const installApp = async (
  id: string,
  variables: Record<string, string>
) =>
  runIfNotBusy(async () =>
    process.env.MOCK !== 'true'
      ? await runInstallApp(id, variables)
      : await appInstallMock(id)
  )

export const getLog = () =>
  process.env.MOCK !== 'true' ? loadLog() : appLogMock()

export const getIsBusy = () => busy
