import * as process from 'process'
import { settingsMock } from '~/mock/settingsMock'

export type Settings = {
  username: string
  password: string
  domain: string
  insecure: boolean
  image: string
}

const validate = (envName: string) => {
  const value = process.env[envName]
  if (!value) throw `${envName} must be set`
  return value
}

let settings: Settings
const loadSettings = (): Settings => {
  if (!settings)
    settings = {
      username: validate('USERNAME'),
      password: validate('PASSWORD'),
      domain: validate('DOMAIN'),
      insecure: process.env.INSECURE === 'true',
      image: process.env.IMAGE || 'lowet84/templates2',
    }
  return settings
}

export const overrideSettings = (settingsOverride: Settings) =>
  (settings = settingsOverride)

export const getSettings = () =>
  process.env.MOCK !== 'true' ? loadSettings() : settingsMock
