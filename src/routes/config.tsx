import {
  refetchRouteData,
  RouteDataArgs,
  Title,
  useRouteData,
} from 'solid-start'
import { buttonStyle } from '~/routes/style'
import { createServerAction$, createServerData$ } from 'solid-start/server'
import { getIsBusy, upgradeApps } from '~/services/appsService'
import { useNavigate } from '@solidjs/router'
import { MenuBar } from '~/components/MenuBar'

export function routeData() {
  return createServerData$(() => ({
    busy: getIsBusy(),
  }))
}

export default function () {
  const [, upgrade] = createServerAction$(() => upgradeApps())
  const data = useRouteData<typeof routeData>()
  const navigate = useNavigate()
  return (
    <>
      <MenuBar />
      <main>
        <Title>Templates - Config</Title>
        <h1>Config</h1>
        <button
          disabled={data()?.busy}
          class={buttonStyle}
          onClick={async () => {
            upgrade()
            navigate('/log')
          }}
        >
          Upgrade Apps
        </button>
      </main>
    </>
  )
}
