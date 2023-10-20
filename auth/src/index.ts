import express from 'express'
import "express-async-errors"
import mongoose from 'mongoose'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'

import router from './routes'

import { errorHandler } from './middlewares/error-handler'
import { NotFoundError } from './errors/not-found-error'

const PORT = process.env.PORT || 3000
const app = express()
app.set('trust proxy', true) // trust traffic from proxy

app.use(json())
app.use(
  cookieSession({
    signed: false,
    secure: true // only https connection
  })
)

app.use('/api/users', router)
app.all('*',  async(req, res) => {
  throw new NotFoundError()
})

app.use(errorHandler)

const start = async () => {
  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth')
    console.log('Connected to MongoDB')
  } catch (err) {
    console.error(err)
  }
  
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
  })
}

start()