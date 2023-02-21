import process from 'process'
import {
  appInstallMock,
  appLogMock,
  appsMock,
  appUninstallMock,
} from '~/mock/appsMock'

export type App = {
  id: string
  description: string
  type: 'app' | 'service'
  state: 'installed' | 'notInstalled'
}

const notImplemented = 'Not implemented'
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

function loadApps(): Promise<App[]> {
  throw notImplemented
}

function loadAppLog(id: string): string {
  throw notImplemented
}

function loadLog(): string {
  throw notImplemented
}

async function runUninstallApp(id: string): Promise<boolean> {
  throw notImplemented
}

async function runInstallApp(id: string): Promise<boolean> {
  throw notImplemented
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
