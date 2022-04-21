import alfy from 'alfy'
import axios from 'axios'
import open from 'open'
import { spawn } from 'child_process'
import { API_ENDPOINT, CLIENT_ID, EXPRESS_PORT } from './config.js'
import { generateRandom, refresh } from './utils.js'

async function login() {
  const challenge = generateRandom(10)
  alfy.cache.set('challenge', challenge)

  const redirectUri = encodeURI(`http://localhost:${EXPRESS_PORT}/authorized`)
  const url = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${redirectUri}&scope=tweet.read%20tweet.write%20users.read%20offline.access&state=state&code_challenge=${challenge}&code_challenge_method=plain`
  await open(url)

  const child = spawn('./node_modules/.bin/run-node', ['src/callback.js'], {
    detached: true,
    env: process.env,
  })
  alfy.cache.set('pid', child.pid)
}

async function tweet(message) {
  const accessToken = await refresh()

  return axios.post(
    `${API_ENDPOINT}/tweets`,
    { text: message },
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  )
}

async function reset() {
  alfy.cache.clear()
  alfy.config.clear()

  process.stdout.write('Successfully reset!')
}

async function runActions() {
  const text = process.argv[2]
  const action = text.split(' ')[0]

  if (action === 'reset') {
    await reset()
    return
  }

  if (action === 'login') {
    await login()
    return
  }

  if (action === 'tweet') {
    const message = text.split(' ').slice(1).join(' ')

    try {
      await tweet(message)
      process.stdout.write('Tweeted!')
    } catch (e) {
      if (e.response && e.response.data) {
        process.stdout.write(JSON.stringify(e.response.data))
      } else {
        process.stdout.write(e.toString())
      }
    }
    return
  }
}

await runActions()
