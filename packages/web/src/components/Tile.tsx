import { css } from 'solid-styled-components'

const rootStyle = css`
  background-color: #4f4f4f;
  color: white;
  padding: 1rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 10px;
  border-radius: 4px;
  height: 60px;
  width: 300px;
`

const titleStyle = css`
  display: flex;
  align-items: center;
`

const logoStyle = css`
  width: 60px;
  height: 60px;
`

export default function (props: {
  title: string
  onClick?: () => void
  onInfoClick?: () => void
}) {
  return (
    <div class={rootStyle} onClick={() => props.onClick && props.onClick()}>
      <div class={titleStyle}>{props.title}</div>
      <img
        onclick={(e) => {
          e.stopPropagation()
          props.onInfoClick && props.onInfoClick()
        }}
        class={logoStyle}
        src={`/${props.title.toLowerCase()}.png`}
        alt={props.title}
      />
    </div>
  )
}
