import { PropertiesServices } from '~/docker/Compose'

export type AppDirectory = Record<
  string,
  { description: string; ingresses?: string[]; services: PropertiesServices }
>
