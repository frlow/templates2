import process from 'process'
import {
  appLogMock,
  appUninstallMock,
  installedAppsMock,
  storeAppsMock,
} from '~/mock/appsMock'

export type InstalledApp = {
  name: string
  type: 'app' | 'service'
}

export type StoreApp = {
  name: string
}

const loadInstalledApps = (): InstalledApp[] => {
  throw 'Not implemented'
}

function loadAppLog(id: string): string {
  throw 'Not implemented'
}

async function runUninstallApp(id: string): Promise<boolean> {
  throw ''
}

function loadStoreApps(): StoreApp[] {
  throw 'Not implemented'
}

export const getInstalledApps = (): InstalledApp[] =>
  process.env.NODE_ENV === 'production'
    ? loadInstalledApps()
    : installedAppsMock

export const getAppLog = (id: string): string =>
  process.env.NODE_ENV === 'production' ? loadAppLog(id) : appLogMock()

export const uninstallApp = (id: string) =>
  process.env.NODE_ENV === 'production'
    ? runUninstallApp(id)
    : appUninstallMock()

export const getStoreApps = (): StoreApp[] =>
  process.env.NODE_ENV === 'production' ? loadStoreApps() : storeAppsMock
