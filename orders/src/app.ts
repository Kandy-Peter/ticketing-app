import express, { Request, Response } from 'express'
import "express-async-errors"
import { json } from 'body-parser'
import cookieSession from 'cookie-session'

import { indexOrderRouter } from './routes'
import { newOrderRouter } from './routes/new'
import { showOrderRouter } from './routes/show'
import { deleteOrderRouter } from './routes/delete'

import { errorHandler, NotFoundError, currentUser } from '@kandy-peter/common'

const app = express()
app.set('trust proxy', true) // trust traffic from proxy

app.use(json())
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
  })
)

app.use(currentUser) 
app.use(indexOrderRouter)
app.use(newOrderRouter)
app.use(showOrderRouter)
app.use(deleteOrderRouter)

app.all('*',  async(req: Request, res: Response) => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app };