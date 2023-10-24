import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';

declare global {
  function signin(): Promise<string[]>
}

let mongo: any;

beforeAll(async () => {
  // set up environment variables

  process.env = Object.assign(process.env, {
    JWT_SECRET_KEY: 'asdf',
    NODE_ENV: 'test',
  });

  // Set up a fake MongoDB server
  mongo = await MongoMemoryServer.create();
  const mongoUri = await mongo.getUri();

  // Connect mongoose to the fake MongoDB server
  await mongoose.connect(mongoUri);
});

// beforeEach(async () => {
//   // Reset all data between tests
//   const collections = await mongoose.connection.db.collections();

//   for (let collection of collections) {
//     await collection.deleteMany({});
//   }
// });

afterAll(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
  // Stop the fake MongoDB server
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = async () => {
  const email = 'test@mail.com';
  const password = 'password';

  const response = await request(app)
    .post('/api/users/signup')
    .send({ email, password })
    .expect(201);

  return response.get('Set-Cookie');
}