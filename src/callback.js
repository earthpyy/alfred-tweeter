import express from 'express'
import { EXPRESS_PORT } from './config.js'

const app = express()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(EXPRESS_PORT)
