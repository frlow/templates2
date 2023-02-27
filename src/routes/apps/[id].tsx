import { useParams } from '@solidjs/router'
import { css } from 'solid-styled-components'
import {
  refetchRouteData,
  RouteDataArgs,
  Title,
  useRouteData,
} from 'solid-start'
import { createServerAction$, createServerData$ } from 'solid-start/server'
import {
  getAppLog,
  getApps,
  getIsBusy,
  installApp,
  uninstallApp,
} from '~/services/appsService'
import { createSignal } from 'solid-js'
import { AppTitle } from '~/components/AppTitle'
import { buttonStyle, inputStyle } from '~/routes/style'
import { getSettings } from '~/services/settingsService'
import { Log } from '~/components/Log'
import { MenuBar } from '~/components/MenuBar'

const rootStyle = css`
  display: flex;
  flex-direction: column;
`

export function routeData({ params }: RouteDataArgs) {
  return createServerData$(
    async (id) => ({
      log: await getAppLog(id),
      app: (await getApps()).find((app) => app.id === id),
      settings: getSettings(),
      busy: getIsBusy(),
    }),
    {
      key: () => params.id,
    }
  )
}

export default function () {
  const { id } = useParams<{ id: string }>()
  const [handling, setHandling] = createSignal(false)
  const [variables, setVariables] = createSignal<Record<string, string>>({})
  const data = useRouteData<typeof routeData>()
  const [, uninstall] = createServerAction$((id: string) => uninstallApp(id))
  const [, install] = createServerAction$(
    (args: { id: string; variables: any }) =>
      installApp(args.id, args.variables)
  )
  return (
    <>
      <MenuBar />
      <Title>Templates - Manage App - {id}</Title>
      <main class={rootStyle}>
        <AppTitle
          id={id}
          onClick={() =>
            data()?.app?.state === 'installed' &&
            (window.location.href = `http://${id}.${data()?.settings.domain}`)
          }
        />
        {data()?.app?.state === 'notInstalled' && data()?.app?.variables && (
          <>
            <h2>Variables</h2>
            {data()?.app?.variables?.map((v) => (
              <>
                <label
                  class={css`
                    color: white;
                  `}
                >
                  {v}
                </label>
                <input
                  class={inputStyle}
                  onChange={(e: any) =>
                    setVariables({ ...variables(), [v]: e.target.value })
                  }
                />
              </>
            ))}
          </>
        )}
        <button
          disabled={handling() || data()?.busy}
          class={buttonStyle}
          onClick={async () => {
            setHandling(true)
            data()?.app?.state === 'installed'
              ? await uninstall(id)
              : await install({ id, variables: variables() })

            await refetchRouteData()
            setHandling(false)
          }}
        >
          {data()?.app?.state === 'installed' ? 'Uni' : 'I'}nstall
          {handling() ? 'ing...' : ''}
        </button>
        {data()?.app?.state === 'installed' && (
          <Log text={data()?.log || ''} onRefresh={() => refetchRouteData()} />
        )}
      </main>
    </>
  )
}
