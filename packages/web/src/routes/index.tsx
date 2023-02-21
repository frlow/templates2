import { Title, useRouteData } from 'solid-start'
import { createServerData$ } from 'solid-start/server'
import { getInstalledApps, InstalledApp } from '~/services/appsService'
import Tile from '~/components/Tile'
import { useNavigate } from '@solidjs/router'
import { getSettings } from '~/services/settingsService'
import { drawerStyle } from '~/routes/style'

export function routeData() {
  return createServerData$(() => ({
    apps: getInstalledApps(),
    settings: getSettings(),
  }))
}

export default function Home() {
  const data = useRouteData<typeof routeData>()
  const navigate = useNavigate()
  return (
    <main>
      <Title>Installed apps</Title>
      <h1>Apps</h1>
      <div class={drawerStyle}>
        {data()
          ?.apps?.filter((app) => app.type === 'app')
          .sort((a, b) => (a.id.localeCompare(b.id) ? -1 : 1))
          .map((app) => (
            <Tile
              title={app.id}
              onClick={() =>
                (window.location.href = `https://${app.id}.${
                  data()?.settings.domain
                }`)
              }
              onInfoClick={() => navigate(`/apps/${app.id}`)}
            />
          ))}
      </div>
      <h1>Services</h1>
      <div class={drawerStyle}>
        {data()
          ?.apps?.filter((app) => app.type === 'service')
          .sort((a, b) => (a.id.localeCompare(b.id) ? -1 : 1))
          .map((app) => (
            <Tile title={app.id} onClick={() => navigate(`/apps/${app.id}`)} />
          ))}
      </div>
    </main>
  )
}
