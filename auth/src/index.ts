import mongoose from 'mongoose'

import { app } from './app'

const PORT = process.env.PORT || 3000
 
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