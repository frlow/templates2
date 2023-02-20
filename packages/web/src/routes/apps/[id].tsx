import { useParams } from '@solidjs/router'
import { css, styled } from 'solid-styled-components'
import { refetchRouteData, RouteDataArgs, useRouteData } from 'solid-start'
import { createServerData$ } from 'solid-start/server'
import { getAppLog } from '~/services/appsService'
import { createEffect } from 'solid-js'

const rootStyle = css`
  display: flex;
  flex-direction: column;
`

const logStyle = css`
  display: flex;
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
  const data = useRouteData<typeof routeData>()
  createEffect(() => {
    const tick = setInterval(() => refetchRouteData(id), 500)
    return () => {
      clearInterval(tick)
    }
  })
  return (
    <main class={rootStyle}>
      <div class={titleStyle}>
        <img class={imageStyle} src={`/${id}.png`} alt={id} />
        <h1>{id}</h1>
      </div>
      <button class={buttonStyle}>Uninstall</button>
      <h3>Log</h3>
      <div class={logStyle}>
        <code>{data()?.log}</code>
      </div>
    </main>
  )
}
