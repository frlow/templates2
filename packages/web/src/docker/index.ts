import { Settings } from '~/services/settingsService'
import { ComposeSpecification } from '~/docker/Compose'

export type DockerActionOptions = {}

export const dockerCommand = (
  compose: ComposeSpecification,
  settings: Settings,
  command: 'up' | 'pull' | 'log',
  log: (msg: string) => void,
  options?: DockerActionOptions
) => {}
