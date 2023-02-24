import YAML from 'yaml'
import fs from 'fs'
import path from 'path'

const yamlApps = fs.readdirSync('./apps').filter(f=>!f.startsWith(".DS_Store"))
const apps = yamlApps.reduce((acc, file) => ({
    ...acc,
    [path.parse(file).name]: YAML.parse(fs.readFileSync(path.join("apps", file), 'utf8'))
}), {})

const code = `import {AppDirectory} from "~/docker/AppDirectory";
export const appDirectory: AppDirectory = ${JSON.stringify(apps, null, 2)}`
fs.writeFileSync('./src/appDirectory.ts', code, 'utf8')