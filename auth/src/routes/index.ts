import express, {Request, Response} from 'express'
import { body,validationResult } from 'express-validator'
import { UserModel } from '../models/user'
import { RequestValidationError } from '../errors/req-validation-errors'
import { BadRequestError } from '../errors/bad-request-error'

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

  const user = await UserModel.findOne({ email });

  if (user) {
    throw new BadRequestError('Email in use');
  }

  const newUser = UserModel.build({ email, password })

  await newUser.save()

  res.status(201).send(newUser)
})

router.post('/signin', (req, res) => {
  res.send('Signing in!')
})

router.post('/signout', (req, res) => {
  res.send('Signing out!')
})

export default router
