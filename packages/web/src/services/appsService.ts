import process from 'process'
import { appLogMock, installedAppsMock } from '~/mock/appsMock'

export type InstalledApp = {
  name: string
  type: 'app' | 'service'
}

const loadInstalledApps = (): InstalledApp[] => {
  throw 'Not implemented'
}

function loadAppLog(id: string): string {
  throw 'Not implemented'
}

export const getInstalledApps = (): InstalledApp[] =>
  process.env.NODE_ENV === 'production'
    ? loadInstalledApps()
    : installedAppsMock

export const getAppLog = (id: string): string =>
  process.env.NODE_ENV === 'production' ? loadAppLog(id) : appLogMock()
