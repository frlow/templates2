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
    state: installed[id] ? 'installed' : 'notInstalled',
    description: value.description,
    type: value.ingresses?.length || 0 > 0 ? 'app' : 'service',
  }))
}

let log = 'Log start\n'

function loadLog(): string {
  return log
}

async function loadAppLog(id: string): Promise<string> {
  if (!getInstalledApps()[id]) return ''
  // TODO generate compose
  // TODO docker-compose log <id>
  throw notImplemented('loadAppLog')
}

async function runUninstallApp(id: string): Promise<boolean> {
  removeInstalledApp(id)
  // TODO generate compose
  // TODO docker-compose up
  throw notImplemented('runUninstallApp')
  return true
}

async function runInstallApp(
  id: string,
  variables: Record<string, string>
): Promise<boolean> {
  addInstalledApp(id, variables)
  const compose = await generateCompose()
  await dockerCommand(compose, 'up', (msg) => (log += `\n${msg}`), {
    args: ['-d', '--remove-orphans'],
  })
  return true
}

// Service API
// process.env.NODE_ENV === 'production'
export const getApps = async () => (true ? await loadApps() : appsMock())

export const getAppLog = async (id: string): Promise<string> =>
  true ? loadAppLog(id) : appLogMock()

export const uninstallApp = async (id: string) =>
  runIfNotBusy(async () =>
    true ? await runUninstallApp(id) : await appUninstallMock(id)
  )

export const installApp = async (
  id: string,
  variables: Record<string, string>
) =>
  runIfNotBusy(async () =>
    true ? await runInstallApp(id, variables) : await appInstallMock(id)
  )

export const getLog = () => (true ? loadLog() : appLogMock())

export const getIsBusy = () => busy
