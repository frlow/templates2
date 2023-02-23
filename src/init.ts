import express from 'express'
import { networkInterfaces } from 'os'
import { dockerInstall } from './docker'
import { overrideSettings } from './services/settingsService'
import inquirer from 'inquirer'
import { execCommand } from '~/docker/exec'
;(async () => {
  const results = await inquirer.prompt([
    {
      name: 'username',
      type: 'input',
      message: 'Enter a username:',
    },
    {
      name: 'password',
      type: 'password',
      message: 'Enter a password:',
    },
    {
      name: 'repeat',
      type: 'password',
      message: 'Repeat password:',
      validate(input: any, answers?: any) {
        const same = input === answers.password
        if (!same) console.log('Passwords do not match')
        return same
      },
    },
    {
      name: 'domain',
      type: 'input',
      message: 'Enter a domain name:',
    },
    {
      name: 'insecure',
      type: 'list',
      default: 'https',
      message: 'Use https encryption?',
      choices: [
        { value: false, name: 'Https (recommended)' },
        { name: 'Http', value: true },
      ],
    },
    {
      name: 'image',
      type: 'input',
      message: 'Docker image to use:',
      default: 'templates2',
    },
    {
      name: 'test',
      type: 'list',
      default: 'yes',
      message: 'Do you want to test that everything is set up properly?',
      choices: [
        { value: true, name: 'Yes (recommended)' },
        { name: 'No', value: false },
      ],
    },
  ])

  if (results.test)
    await (async () => {
      const publicIp = (
        await fetch('https://api.ipify.org?format=json').then((r) => r.json())
      ).ip
      const internalIps = Object.values(networkInterfaces())
        .flatMap((n) => n)
        .filter((n) => n?.family === 'IPv4')
        .map((n) => n?.address)
        .filter((a) => a)
        .filter((a) => !a?.startsWith('127'))
      const createServer = (port: number) => {
        const randomNumber = Math.random().toString()
        const app = express()
        app.get('/', (req, res) => {
          res.setHeader('content-type', 'text/plain')
          res.send(randomNumber)
        })
        const server = app.listen(port)
        return { ref: randomNumber, close: () => server.close() }
      }
      const testConnection = async (
        host: string,
        port: number,
        message: string
      ): Promise<void> => {
        const { ref, close } = createServer(port)
        try {
          const result = await fetch(`http://${host}:${port}/`).then((r) =>
            r.text()
          )
          if (result !== ref) throw ''
        } catch {
          console.log(message)
          process.exit(1)
        }
        await new Promise((r) => setTimeout(() => r(''), 1000))
        console.log(`${host}:${port} has successfully been forwarded`)
        await close()
      }
      await testConnection(
        publicIp,
        80,
        `Make sure that port ${80} is forwarded to one of internal ips "${internalIps.join(
          ','
        )}"`
      )
      await testConnection(
        publicIp,
        443,
        `Make sure that port ${443} is forwarded to one of internal ips "${internalIps.join(
          ','
        )}"`
      )
      await testConnection(
        results.domain,
        80,
        `Make sure ${results.domain} is forwarded to ${publicIp}`
      )
    })()
  overrideSettings(results)
  dockerInstall((msg) => {
    console.log(msg)
  }).then(() => process.exit(0))
})()
