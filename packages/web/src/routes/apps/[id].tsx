import { useNavigate, useParams } from '@solidjs/router'
import { css } from 'solid-styled-components'
import { refetchRouteData, RouteDataArgs, useRouteData } from 'solid-start'
import { createServerAction$, createServerData$ } from 'solid-start/server'
import { getAppLog, uninstallApp } from '~/services/appsService'
import { createSignal } from 'solid-js'

const rootStyle = css`
  display: flex;
  flex-direction: column;
`

const logStyle = css`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  white-space: pre-wrap;
  color: white;
  width: calc(100vw - 2rem);
`

const titleStyle = css`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const imageStyle = css`
  width: 60px;
  height: 60px;
`

const buttonStyle = css`
  padding: 1rem;
  border-radius: 4px;
  border: 1px solid white;
  background-color: #6e6e6e;
  color: white;
  min-width: 300px;
`

export function routeData({ params }: RouteDataArgs) {
  return createServerData$((id) => ({ log: getAppLog(id) }), {
    key: () => params.id,
  })
}

export default function () {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [busy, setBusy] = createSignal(false)
  const data = useRouteData<typeof routeData>()
  const [, uninstall] = createServerAction$((id: string) => uninstallApp(id))
  return (
    <main class={rootStyle}>
      <div class={titleStyle}>
        <img class={imageStyle} src={`/${id}.png`} alt={id} />
        <h1>{id}</h1>
      </div>
      <button
        disabled={busy()}
        class={buttonStyle}
        onClick={async () => {
          setBusy(true)
          const result = await uninstall(id)
          if (result) navigate('/')
          setBusy(false)
        }}
      >
        {busy() ? 'Uninstalling...' : 'Uninstall'}
      </button>
      <h3>Log</h3>
      <div class={logStyle}>
        <code>{data()?.log}</code>
        <button
          class={css`
            border: none;
            background-color: transparent;
            color: #dab1b1;
            padding: 1rem 0 0;
          `}
          onclick={() => refetchRouteData()}
        >
          Load more...
        </button>
      </div>
    </main>
  )
}
