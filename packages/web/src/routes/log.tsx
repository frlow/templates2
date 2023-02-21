import { Log } from '~/components/Log'
import { createServerData$ } from 'solid-start/server'
import { getLog } from '~/services/appsService'
import { refetchRouteData, useRouteData } from 'solid-start'

export function routeData() {
  return createServerData$(async () => ({
    log: await getLog(),
  }))
}

export default function () {
  const data = useRouteData<typeof routeData>()
  return (
    <main>
      <h1>log</h1>
      <Log
        text={data()?.log || ''}
        onRefresh={() => refetchRouteData()}
        auto={true}
      ></Log>
    </main>
  )
}
