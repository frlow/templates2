import { css } from 'solid-styled-components'

const titleStyle = css`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const imageStyle = css`
  width: 60px;
  height: 60px;
`

export const AppTitle = (props: { id: string; onClick?: () => void }) => {
  return (
    <div class={titleStyle} onclick={() => props.onClick && props.onClick()}>
      <img class={imageStyle} src={`/${props.id}.png`} alt={props.id} />
      <h1>{props.id}</h1>
    </div>
  )
}
