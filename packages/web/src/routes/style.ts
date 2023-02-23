import { css } from 'solid-styled-components'

export const drawerStyle = css`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
`

export const buttonStyle = css`
  padding: 1rem;
  border-radius: 4px;
  border: 1px solid white;
  background-color: #6e6e6e;
  color: white;
  min-width: 300px;

  &:disabled {
    color: #d38a8a;
    background-color: #4f4f4f;
  }
`

export const inputStyle = css`
  width: 300px;
  padding: 1.1rem;
  border-radius: 1rem;
  border: white;
  background-color: #4f6679;
  color: white;

  &::placeholder {
    color: #b4c0ce;
  }
`
