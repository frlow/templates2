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

const loadSettings = (): Settings => ({
  username: validate('USERNAME'),
  password: validate('PASSWORD'),
  domain: validate('DOMAIN'),
  insecure: process.env.INSECURE === 'true',
  image: process.env.IMAGE || 'templates2',
})

export const getSettings = () =>
  process.env.MOCK !== 'true' ? loadSettings() : settingsMock
