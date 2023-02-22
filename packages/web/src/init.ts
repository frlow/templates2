import { dockerInstall } from '~/docker'

dockerInstall((msg) => {
  console.log(msg)
}).then(() => process.exit(0))
