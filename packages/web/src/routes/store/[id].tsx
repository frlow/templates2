import { RouteDataArgs, Title, useRouteData } from 'solid-start'
import { createServerAction$, createServerData$ } from 'solid-start/server'
import { useNavigate, useParams } from '@solidjs/router'
import { AppTitle } from '~/components/AppTitle'
import { buttonStyle } from '~/routes/style'
import { getStoreApp, installApp } from '~/services/appsService'
import { css } from 'solid-styled-components'
import { createSignal } from 'solid-js'

export function routeData({ params }: RouteDataArgs) {
  return createServerData$((id) => ({ app: getStoreApp(id) }), {
    key: () => params.id,
  })
}

const detailsStyle = css`
  color: white;
  padding: 1rem;
  text-align: left;
  width: 300px;
`

export default function () {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const data = useRouteData<typeof routeData>()
  const [, install] = createServerAction$((id: string) => installApp(id))
  const [busy, setBusy] = createSignal(false)
  return (
    <main>
      <Title>Install {id}</Title>
      <AppTitle id={id} />
      <div class={detailsStyle}>{data()?.app.description}</div>
      <button
        class={buttonStyle}
        disabled={busy()}
        onClick={async () => {
          setBusy(true)
          const result = await install(id)
          if (result) navigate(`/apps/${id}`)
          setBusy(false)
        }}
      >
        {busy() ? 'Installing...' : 'Install'}
      </button>
    </main>
  )
}
