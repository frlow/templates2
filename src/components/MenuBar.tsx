import { css } from 'solid-styled-components'
import { A } from 'solid-start'

export const MenuBar = () => {
  return (
    <nav
      class={css`
        a {
          color: white;
        }
      `}
    >
      <A href="/">Apps</A>
      <A href="/install">Install</A>
      <A href="/log">Log</A>
      <A href="/config">Config</A>
    </nav>
  )
}
