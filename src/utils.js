import alfy from 'alfy'
import axios from 'axios'
import qs from 'qs'
import { ACCESS_TOKEN_AGE_SECONDS, API_ENDPOINT, CLIENT_ID } from './config.js'

export function generateRandom(length) {
  var result = ''
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export function killProcess(pid = null) {
  if (!pid) {
    pid = alfy.cache.get('pid')
  }
  if (!pid) {
    return
  }

  alfy.cache.delete('pid')
  process.kill(-pid, 'SIGINT')
}

export async function refresh(refreshToken = null) {
  if (!refreshToken) {
    refreshToken = alfy.config.get('refreshToken')
  }

  const payload = {
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
    client_id: CLIENT_ID,
  }
  const tokenResponse = await axios.post(`${API_ENDPOINT}/oauth2/token`, qs.stringify(payload))
  alfy.cache.set('accessToken', tokenResponse.data.access_token, { maxAge: 1000 * ACCESS_TOKEN_AGE_SECONDS })
  alfy.config.set('refreshToken', tokenResponse.data.refresh_token)

  return tokenResponse.data.access_token
}
