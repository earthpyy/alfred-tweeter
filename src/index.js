import alfy from 'alfy'
import { MAX_LENGTH } from './config.js'
import { killProcess } from './utils.js'

async function main() {
  const refreshToken = alfy.config.get('refreshToken')
  if (!refreshToken) {
    killProcess()

    alfy.output([
      {
        title: 'Login with Twitter',
        subtitle: 'First time only. This will open a new browser window to login.',
        arg: 'login',
      },
    ])
    return
  }

  const leftLength = MAX_LENGTH - alfy.input.length
  if (leftLength < 0) {
    alfy.error('Message exceeded the characters limit!')
    return
  }

  alfy.output([
    {
      title: `Tweet '${alfy.input}'`,
      subtitle: `${leftLength} characters remaining`,
      arg: `tweet ${alfy.input}`,
    },
  ])
}

await main()
