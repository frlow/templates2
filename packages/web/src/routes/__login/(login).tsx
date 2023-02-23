import { APIEvent, redirect } from 'solid-start/api'
import { buttonStyle, inputStyle } from '~/routes/style'
import { getSettings } from '~/services/settingsService'
import { css } from 'solid-styled-components'
import { useLocation } from '@solidjs/router'
import { generateToken } from '~/routes/__login/q'

const formStyle = css`
  display: flex;
  flex-direction: column;
  color: white;
`

const submitStyle = css`
  margin-top: 1rem;
`

const labelStyle = css`
  text-transform: uppercase;
  font-weight: 300;
  padding: 5px;
`

export default function () {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const wrongPass = searchParams.get('wrongpass')
  return (
    <main>
      <h1>Login</h1>
      <form method={'post'} class={formStyle} enctype="multipart/form-data">
        <label for={'username'} class={labelStyle}>
          Username
        </label>
        <input id={'username'} name={'username'} class={inputStyle} />
        <label for={'password'} class={labelStyle}>
          Password
        </label>
        <input
          id={'password'}
          name={'password'}
          type={'password'}
          class={inputStyle}
        />
        {wrongPass && (
          <div
            class={css`
              color: firebrick;
            `}
          >
            Wrong username or password
          </div>
        )}
        <input
          type={'submit'}
          class={`${buttonStyle} ${submitStyle}`}
          value={'Login'}
        />
      </form>
    </main>
  )
}

export async function POST({ request }: APIEvent) {
  const settings = getSettings()
  const data = await request.formData()
  const username = data.get('username')
  const password = data.get('password')

  const searchParams = new URLSearchParams(
    request.url.substring(request.url.indexOf('?'))
  )
  const redirectQuery = searchParams.get('redirect')
  if (username === settings.username && password === settings.password) {
    const token = generateToken()
    return redirect(redirectQuery || '/', {
      headers: {
        'set-cookie': `access-token=${token}; Domain=${settings.domain}`,
      },
    })
  } else {
    const queries = ['wrongpass=true']
    if (redirectQuery) queries.push(`redirect=${redirectQuery}`)
    return redirect(`/__login?${queries.join('&')}`)
  }
}
