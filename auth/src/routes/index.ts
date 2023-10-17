import express, {Request, Response} from 'express'
import { body,validationResult } from 'express-validator'
import { RequestValidationError } from '../errors/req-validation-errors'
import { DatabaseConnectionError } from '../errors/db-connection-error' 

const router = express.Router()

router.get('/currentuser', (req, res) => {
  res.send('Hello there, I am the current user!')
})

router.post('/signup', [
  body('email').isEmail().withMessage('Email must be valid'),
  body('password').trim().isLength({ min: 4, max: 20 }).withMessage('Password must be between 4 and 20 characters')
],
async (req: Request, res: Response) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array())
  }
  const { email, password } = req.body

  console.log('Creating a user...')

  throw new DatabaseConnectionError()
  res.send({}) 
})

router.post('/signin', (req, res) => {
  res.send('Signing in!')
})

router.post('/signout', (req, res) => {
  res.send('Signing out!')
})

export default router
