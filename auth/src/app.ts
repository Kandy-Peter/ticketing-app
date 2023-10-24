import express, { Request, Response } from 'express'
import "express-async-errors"
import { json } from 'body-parser'
import cookieSession from 'cookie-session'

import router from './routes'

import { errorHandler, NotFoundError } from '@kandy-peter/common'

const app = express()
app.set('trust proxy', true) // trust traffic from proxy

app.use(json())
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test' // only send cookie over https connection
  })
)

app.use('/api/users', router)
app.all('*',  async(req: Request, res: Response) => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app };