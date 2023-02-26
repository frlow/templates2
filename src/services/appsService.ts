import process from 'process'
import {
  appInstallMock,
  appLogMock,
  appsMock,
  appUninstallMock,
  upgradeAppsMock,
} from '~/mock/appsMock'
import { appDirectory } from '~/appDirectory'
import * as fs from 'fs'
import { dockerInstall, dockerLog, dockerPull } from '~/docker'

export type AppType = 'app' | 'service'
export type AppState = 'installed' | 'notInstalled'
export type App = {
  id: string
  description: string
  state: AppState
  ingresses: { name: string }[]
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
    ingresses: Object.entries(value.ingresses || {}).map(([key, value]) => ({
      name: key,
    })),
  }))
}

let log = 'Log start\n'

function loadLog(): string {
  return log
}

async function loadAppLog(id: string): Promise<string> {
  if (!getInstalledApps()[id]) return ''
  let appLog = ''
  await dockerLog(id, (msg) => (appLog += msg))
  return appLog
}

async function runUninstallApp(id: string): Promise<boolean> {
  removeInstalledApp(id)
  await dockerInstall((msg) => (log += msg))
  return true
}

async function runInstallApp(
  id: string,
  variables: Record<string, string>
): Promise<boolean> {
  addInstalledApp(id, variables)
  await dockerInstall((msg) => (log += msg))
  return true
}

async function runUpgradeApps() {
  await dockerPull((msg) => (log += msg))
  await dockerInstall((msg) => (log += msg))
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

export const upgradeApps = () =>
  process.env.MOCK !== 'true' ? runUpgradeApps() : upgradeAppsMock()

export const getIsBusy = () => busy
