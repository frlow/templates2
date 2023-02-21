import process from 'process'
import {
  appInstallMock,
  appLogMock,
  appUninstallMock,
  installedAppsMock,
  storeAppMock,
  storeAppsMock,
} from '~/mock/appsMock'

export type App = {
  id: string
  description: string
  type: 'app' | 'service'
}

const notImplemented = 'Not implemented'

const loadInstalledApps = (): App[] => {
  throw notImplemented
}

function loadAppLog(id: string): string {
  throw notImplemented
}

async function runUninstallApp(id: string): Promise<boolean> {
  throw notImplemented
}

async function runInstallApp(id: string): Promise<boolean> {
  throw notImplemented
}

function loadStoreApps(): App[] {
  throw notImplemented
}

function loadStoreApp(id: string): App {
  throw notImplemented
}

export const getInstalledApps = (): App[] =>
  process.env.NODE_ENV === 'production'
    ? loadInstalledApps()
    : installedAppsMock

export const getAppLog = (id: string): string =>
  process.env.NODE_ENV === 'production' ? loadAppLog(id) : appLogMock()

export const uninstallApp = (id: string) =>
  process.env.NODE_ENV === 'production'
    ? runUninstallApp(id)
    : appUninstallMock(id)

export const installApp = (id: string) =>
  process.env.NODE_ENV === 'production' ? runInstallApp(id) : appInstallMock(id)

export const getStore = (): App[] =>
  process.env.NODE_ENV === 'production' ? loadStoreApps() : storeAppsMock

export const getStoreApp = (id: string): App =>
  process.env.NODE_ENV === 'production' ? loadStoreApp(id) : storeAppMock
