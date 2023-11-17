import mongoose from 'mongoose'

import { app } from './app'

const PORT = process.env.PORT || 3000
 
const start = async () => {
  // const NATS_CLUSTER_ID = process.env.NATS_CLUSTER_ID
  // const NATS_CLIENT_ID = process.env.NATS_CLIENT_ID
  // const NATS_URL = process.env.NATS_URL
   try {
     if (!process.env.JWT_SECRET_KEY || !process.env.MONGO_URI) {
      throw new Error('JWT_SECRET_KEY and MONGO_URI must be defined')
    }

    // if (!NATS_CLIENT_ID || !NATS_URL || !NATS_CLUSTER_ID) {
    //   throw new Error('NATS_CLIENT_ID, NATS_URL and NATS_CLUSTER_ID must be defined')
    // }

    // await natsWrapper.connect(NATS_CLUSTER_ID, NATS_CLIENT_ID, NATS_URL)
    // const client = natsWrapper.client
    // client.on('close', () => {
    //   console.log('NATS connection closed!');
    //   process.exit();
    // });
    // process.on('SIGINT', () => client.close());
    // process.on('SIGTERM', () => client.close());

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
