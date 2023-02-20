import { Title, useRouteData } from 'solid-start'
import { createServerData$ } from 'solid-start/server'
import { getInstalledApps, InstalledApp } from '~/services/appsService'
import Tile from '~/components/Tile'
import { useNavigate } from '@solidjs/router'
import { getSettings } from '~/services/settingsService'
import { css } from 'solid-styled-components'

export function routeData() {
  return createServerData$(() => ({
    apps: getInstalledApps(),
    settings: getSettings(),
  }))
}

const drawerStyle = css`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
`

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
          .sort((a, b) => (a.name.localeCompare(b.name) ? -1 : 1))
          .map((app) => (
            <Tile
              title={app.name}
              onClick={() =>
                (window.location.href = `https://${app.name.toLowerCase()}.${
                  data()?.settings.domain
                }`)
              }
              onInfoClick={() => navigate(`/apps/${app.name.toLowerCase()}`)}
            />
          ))}
      </div>
      <h1>Services</h1>
      <div class={drawerStyle}>
        {data()
          ?.apps?.filter((app) => app.type === 'service')
          .sort((a, b) => (a.name.localeCompare(b.name) ? -1 : 1))
          .map((app) => (
            <Tile
              title={app.name}
              onClick={() => navigate(`/apps/${app.name.toLowerCase()}`)}
              onInfoClick={() => navigate(`/apps/${app.name.toLowerCase()}`)}
            />
          ))}
      </div>
    </main>
  )
}
