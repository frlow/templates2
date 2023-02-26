import { PropertiesServices } from '~/docker/Compose'

export type IngressConfig =
  | {
      domain?: string
      port: number
      service?: string
      insecure?: boolean
      protocol?: 'http' | 'https'
    }
  | number
export type AppConfig = {
  description: string
  ingresses?: Record<string, IngressConfig>
  services: PropertiesServices
  variables?: string[]
}

export type AppDirectory = Record<string, AppConfig>
