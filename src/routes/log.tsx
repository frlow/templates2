import { Log } from '~/components/Log'
import { createServerData$ } from 'solid-start/server'
import { getLog } from '~/services/appsService'
import { refetchRouteData, useRouteData } from 'solid-start'
import { MenuBar } from '~/components/MenuBar'

export function routeData() {
  return createServerData$(async () => ({
    log: getLog(),
  }))
}

export default function () {
  const data = useRouteData<typeof routeData>()
  return (
    <>
      <MenuBar />
      <main>
        <h1>log</h1>
        <Log
          text={data()?.log || ''}
          onRefresh={() => refetchRouteData()}
          auto={true}
        ></Log>
      </main>
    </>
  )
}
