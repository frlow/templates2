import * as fs from 'fs'
import { nanoid } from 'nanoid'
import { APIEvent, redirect } from 'solid-start/api'
import { getSettings } from '~/services/settingsService'

const tokensPath = './data/tokens.json'
const readTokens = (): Record<string, number> => {
  if (!fs.existsSync(tokensPath)) fs.writeFileSync(tokensPath, '{}', 'utf8')
  const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf8')) as Record<
    string,
    number
  >
  Object.entries(tokens).forEach(([token, time]) => {
    if (Date.now() > time) delete tokens[token]
  })
  return tokens
}

export const generateToken = () => {
  const token = nanoid(32)
  const tokens = readTokens()
  const expires = Date.now() + 86400000
  tokens[token] = expires
  fs.writeFileSync(tokensPath, JSON.stringify(tokens, null, 2), 'utf8')
  return { token, expires }
}

export const parseCookies = (request: Request) =>
  (request.headers.get('cookie') || '')
    .split(';')
    .map((c) => c.trim().split('='))
    .reduce((acc, cur) => {
      acc[cur[0]] = cur[1]
      return acc
    }, {} as Record<string, string>)

export function GET({ request }: APIEvent) {
  const tokens = readTokens()
  const settings = getSettings()
  const accessToken = parseCookies(request)['access-token']
  if (tokens[accessToken]) return new Response(null, { status: 200 })
  const forwardUrl =
    request.headers.get('x-forwarded-uri')?.split('?')[0] || '/'
  const forwardedHost = request.headers.get('x-forwarded-host')
  return redirect(
    `http${
      settings.insecure ? '' : 's'
    }://${forwardedHost}/__login?redirect=${forwardUrl}`
  )
}
