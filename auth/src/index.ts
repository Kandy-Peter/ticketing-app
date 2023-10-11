import express from 'express'
import { json } from 'body-parser'

const app = express()
const PORT = process.env.PORT || 3000

app.use(json())

app.get('/api/users/currentuser', (req, res) => {
  res.send('Hello there, I am the current user!')
})

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`)
})
