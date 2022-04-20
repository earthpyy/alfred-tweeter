import alfy from 'alfy'
import axios from 'axios'
import open from 'open'
import { spawn } from 'child_process'
import { API_ENDPOINT, CLIENT_ID, EXPRESS_PORT, LOGIN_TIMEOUT_SECONDS } from './config.js'

async function login() {
  const url = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=http://localhost:${EXPRESS_PORT}/authorized&scope=tweet.read%20tweet.write%20users.read&code_challenge=challenge&code_challenge_method=plain`
  await open(url)

  const child = spawn('./node_modules/.bin/run-node', ['src/callback.js'], { detached: true })
  setTimeout(() => process.kill(-child.pid, 'SIGINT'), 1000 * LOGIN_TIMEOUT_SECONDS)
}

async function tweet(message) {
  return axios.post(
    `${API_ENDPOINT}/tweets`,
    { text: message },
    {
      headers: { Authorization: `Bearer ${alfy.config.accessToken}` },
    }
  )
}

async function runActions() {
  const text = process.argv[2]
  const action = text.split(' ')[0]

  if (action === 'login') {
    await login()
    return
  }

  if (action === 'tweet') {
    const message = text.split(' ').slice(1).join(' ')
    await tweet(message)
    process.stdout.write('Tweeted!')
    return
  }
}

await runActions()
