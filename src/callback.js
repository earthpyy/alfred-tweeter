import alfy from 'alfy'
import axios from 'axios'
import express from 'express'
import qs from 'qs'
import { API_ENDPOINT, CLIENT_SECRET, EXPRESS_PORT } from './config.js'

const app = express()

app.get('/authorized', async (req, res) => {
  const code = req.query.code
  if (!code) {
    res.send('Invalid code!')
  }

  const payload = {
    code,
    grant_type: 'authorization_code',
    redirect_uri: `http://localhost:${EXPRESS_PORT}/tokenized`,
    code_verifier: 'challenge',
  }
  await axios.post(`${API_ENDPOINT}/oauth2/token`, qs.stringify(payload), {
    headers: { Authorization: `Basic ${CLIENT_SECRET}` },
  })
})

app.get('/tokenized', async (req, res) => {
  // TODO: set alfy config

  // kill express
  process.kill(-alfy.cache.get('pid'))
  alfy.cache.delete('pid')

  res.send('Success! You can close this browser.')
})

app.listen(EXPRESS_PORT)
