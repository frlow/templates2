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
