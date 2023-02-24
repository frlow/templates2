import { PropertiesServices } from '~/docker/Compose'

export type AppConfig = {
  description: string
  ingresses?: Record<
    string,
    { domain?: string; port: number; insecure?: boolean } | number
  >
  services: PropertiesServices
  variables?: string[]
}

export type AppDirectory = Record<string, AppConfig>
