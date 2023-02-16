import express from 'express'
import { getPage } from './html'

const app = express()
app.use(express.json())

app.get('/', async (req, res) => {
  res.setHeader('content-type', 'text/html')
  res.send(getPage())
})

app.post('/', (req, res) => {
  res.sendStatus(200)
})

app.listen(4000)
app.listen(80)
app.listen(443)
console.log('Listening on http://localhost:4000')
console.log('Listening on http://localhost:80')
console.log('Listening on http://localhost:443 <- Note HTTP, only for setup')
