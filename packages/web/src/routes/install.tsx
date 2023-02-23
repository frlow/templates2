import { Title, useRouteData } from 'solid-start'
import { createServerData$ } from 'solid-start/server'
import { getApps } from '~/services/appsService'
import { drawerStyle, inputStyle } from '~/routes/style'
import Tile from '~/components/Tile'
import { useNavigate } from '@solidjs/router'
import { css } from 'solid-styled-components'
import { createSignal } from 'solid-js'
import { MenuBar } from '~/components/MenuBar'

export function routeData() {
  return createServerData$(async () => ({
    apps: await getApps(),
  }))
}

export default function () {
  const data = useRouteData<typeof routeData>()
  const [search, setSearch] = createSignal('')
  const navigate = useNavigate()
  return (
    <>
      <MenuBar />
      <main>
        <Title> Store</Title>
        <h1>Install</h1>
        <input
          class={inputStyle}
          onInput={(e: any) => setSearch(e.target.value)}
          placeholder={'search'}
        ></input>
        <div class={drawerStyle}>
          {data()
            ?.apps?.filter((app) => app.state === 'notInstalled')
            .filter((app) => app.id.includes(search()))
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
