import { Title } from 'solid-start'
import { createServerData$ } from 'solid-start/server'
import { getInstalledApps, getStoreApps } from '~/services/appsService'

export function routeData() {
  return createServerData$(() => ({
    apps: getStoreApps(),
    installed: getInstalledApps(),
  }))
}

export default function () {
  return (
    <main>
      <Title>Store</Title>
      <h1>Install</h1>
    </main>
  )
}
