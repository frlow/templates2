import { Title, useRouteData } from 'solid-start'
import { createServerData$ } from 'solid-start/server'
import { getApps } from '~/services/appsService'
import Tile from '~/components/Tile'
import { useNavigate } from '@solidjs/router'
import { getSettings } from '~/services/settingsService'
import { drawerStyle } from '~/routes/style'
import { MenuBar } from '~/components/MenuBar'

export function routeData() {
  return createServerData$(async () => ({
    apps: await getApps(),
    settings: getSettings(),
  }))
}

export default function Home() {
  const data = useRouteData<typeof routeData>()
  const navigate = useNavigate()
  return (
    <>
      <MenuBar />
      <main>
        <Title>Installed apps</Title>
        <h1>Apps</h1>
        <div class={drawerStyle}>
          {data()
            ?.apps?.filter(
              (app) => app.type === 'app' && app.state === 'installed'
            )
            .sort((a, b) => (a.id.localeCompare(b.id) ? -1 : 1))
            .map((app) => (
              <Tile
                title={app.id}
                onClick={() =>
                  (window.location.href = `http://${app.id}.${
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
            ?.apps?.filter(
              (app) => app.type === 'service' && app.state === 'installed'
            )
            .sort((a, b) => (a.id.localeCompare(b.id) ? -1 : 1))
            .map((app) => (
              <Tile
                title={app.id}
                onClick={() => navigate(`/apps/${app.id}`)}
              />
            ))}
        </div>
      </main>
    </>
  )
}
