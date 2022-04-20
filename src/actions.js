import { spawn } from 'child_process'
import open from 'open'
import { CLIENT_ID, EXPRESS_PORT, LOGIN_TIMEOUT_SECONDS } from './config.js'

function login() {
  const url = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=http://localhost:${EXPRESS_PORT}&scope=tweet.read%20tweet.write%20users.read&state=state&code_challenge=challenge&code_challenge_method=plain`
  open(url)

  const child = spawn('./node_modules/.bin/run-node', ['src/callback.js'], { detached: true })
  setTimeout(() => process.kill(-child.pid, 'SIGINT'), 1000 * LOGIN_TIMEOUT_SECONDS)
}

function tweet(message) {
  console.log(message)
}

function runActions() {
  const text = process.argv[2]
  const action = text.split(' ')[0]

  if (action === 'login') {
    login()
    return
  }

  // tweet
  const message = text.split(' ').slice(1).join(' ')
  tweet(message)
}

runActions()
