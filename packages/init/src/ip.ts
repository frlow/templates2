import { networkInterfaces } from 'os'

export const getLocalIp = () => {
  const nets = networkInterfaces()
  return Object.entries(nets)
    .map(([key, addresses]) => {
      const v4 = addresses?.find((address) => address.family === 'IPv4')
      if (!v4) return undefined
      return { name: key, ip: v4.address }
    })
    .filter((n) => n)
    .flatMap((n) => n)
    .find((ip) => ip?.name === 'en0')?.ip
}

export const getPublicIp = async () => {
  const result = await fetch('https://api.ipify.org?format=json').then((r) =>
    r.json()
  )
  return result.ip
}

export const randomKey = Math.random()
export const testPort = async (port: number) => {
  const result = await fetch(`http://${await getPublicIp()}:${port}/test`).then(
    (r) => r.text()
  )
  debugger
}
