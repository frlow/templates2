import { css } from 'solid-styled-components'
import { onCleanup, onMount } from 'solid-js'

const logStyle = css`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  white-space: pre-wrap;
  color: white;
  width: calc(100vw - 2rem);
`

export const Log = (props: {
  text: string
  onRefresh: () => void
  auto?: boolean
}) => {
  if (props.auto) {
    let interval: any
    onMount(() => (interval = setInterval(() => props.onRefresh(), 500)))
    onCleanup(() => clearInterval(interval))
  }
  return (
    <div>
      <h3>Log</h3>
      <div class={logStyle}>
        <code>{props.text}</code>
        {!props.auto && (
          <button
            class={css`
              border: none;
              background-color: transparent;
              color: #dab1b1;
              padding: 1rem 0 0;
            `}
            onClick={() => props.onRefresh()}
          >
            Load more...
          </button>
        )}
      </div>
    </div>
  )
}
