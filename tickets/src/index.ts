import mongoose from 'mongoose'

import { app } from './app'

const PORT = process.env.PORT || 3000
 
 const start = async () => {
  try {
    if (!process.env.JWT_SECRET_KEY || !process.env.MONGO_URI) {
      throw new Error('JWT_SECRET_KEY and MONGO_URI must be defined')
    }

    await mongoose.connect(`${process.env.MONGO_URI}`)
    console.log('Connected to MongoDB')
  } catch (err) {
    console.error(err)
  }
  
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
  })
}

start()
