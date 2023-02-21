import process from 'process'
import {
  appInstallMock,
  appLogMock,
  appsMock,
  appUninstallMock,
} from '~/mock/appsMock'
import { appDirectory } from '~/apps'
import * as fs from 'fs'

export type App = {
  id: string
  description: string
  type: 'app' | 'service'
  state: 'installed' | 'notInstalled'
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

const installedAppsPath = './apps.json'
const saveInstalledApps = (apps: string[]) =>
  fs.writeFileSync(installedAppsPath, JSON.stringify(apps), 'utf8')

const getInstalledApps = (): string[] => {
  if (!fs.existsSync(installedAppsPath)) saveInstalledApps([])
  return JSON.parse(fs.readFileSync(installedAppsPath, 'utf8'))
}

const addInstalledApp = (id: string) => {
  const apps = getInstalledApps().reduce(
    (acc, cur) => ({ ...acc, [cur]: cur }),
    {} as any
  )
  apps[id] = id
  saveInstalledApps(Object.keys(apps))
}

const removeInstalledApp = (id: string) => {
  const apps = getInstalledApps().reduce(
    (acc, cur) => ({ ...acc, [cur]: cur }),
    {} as any
  )
  delete apps[id]
  saveInstalledApps(Object.keys(apps))
}

async function loadApps(): Promise<App[]> {
  const installed = getInstalledApps()
  return Object.entries(appDirectory).map(([id, value]) => ({
    id,
    state: installed.includes(id) ? 'installed' : 'notInstalled',
    description: value.description,
    type: value.ingresses?.length || 0 > 0 ? 'app' : 'service',
  }))
}

function loadAppLog(id: string): string {
  if (!getInstalledApps().includes(id)) return ''
  return 'dummy'
}

function loadLog(): string {
  throw notImplemented('loadLog')
}

async function runUninstallApp(id: string): Promise<boolean> {
  removeInstalledApp(id)
  return true
}

async function runInstallApp(id: string): Promise<boolean> {
  addInstalledApp(id)
  return true
}

export const getApps = async () =>
  process.env.NODE_ENV === 'production' ? await loadApps() : appsMock()

export const getAppLog = (id: string): string =>
  process.env.NODE_ENV === 'production' ? loadAppLog(id) : appLogMock()

export const uninstallApp = async (id: string) =>
  runIfNotBusy(async () =>
    process.env.NODE_ENV === 'production'
      ? await runUninstallApp(id)
      : await appUninstallMock(id)
  )

export const installApp = async (id: string) =>
  runIfNotBusy(async () =>
    process.env.NODE_ENV === 'production'
      ? await runInstallApp(id)
      : await appInstallMock(id)
  )

export const getLog = async () =>
  process.env.NODE_ENV === 'production' ? loadLog() : appLogMock()

export const getIsBusy = () => busy
