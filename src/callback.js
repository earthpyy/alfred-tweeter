import alfy from 'alfy'
import axios from 'axios'
import express from 'express'
import qs from 'qs'
import { API_ENDPOINT, CLIENT_ID, EXPRESS_PORT, LOGIN_TIMEOUT_SECONDS } from './config.js'
import { killProcess } from './utils.js'

const app = express()

app.get('/authorized', async (req, res) => {
  const code = req.query.code
  if (!code) {
    res.send('Invalid code!')
  }

  const payload = {
    code,
    grant_type: 'authorization_code',
    client_id: CLIENT_ID,
    redirect_uri: `http://localhost:${EXPRESS_PORT}/authorized`,
    code_verifier: alfy.cache.get('challenge'),
  }
  const tokenResponse = await axios.post(`${API_ENDPOINT}/oauth2/token`, qs.stringify(payload))

  // save token
  alfy.config.set('refreshToken', tokenResponse.data.refresh_token)

  res.send('Success! You can close this browser.')

  // kill express
  killProcess()
})

// auto exit
setTimeout(() => {
  alfy.cache.delete('pid')
  process.exit(0)
}, 1000 * LOGIN_TIMEOUT_SECONDS)

app.listen(EXPRESS_PORT)
