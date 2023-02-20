import * as process from 'process'
import { settingsMock } from '~/mock/settingsMock'

export type Settings = {
  username: string
  password: string
  domain: string
}

const validate = (envName: string) => {
  const value = process.env[envName]
  if (!value) throw `${envName} must be set`
  return value
}

const loadSettings = (): Settings => ({
  username: validate('USERNAME'),
  password: validate('PASSWORD'),
  domain: validate('DOMAIN'),
})

export const getSettings = () =>
  process.env.NODE_ENV === 'production' ? loadSettings() : settingsMock
