import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { app } from '../app';

declare global {
  function signin(): string[];
}

let mongo: any;

jest.mock('../nats-wrapper');

beforeAll(async () => {
  // set up environment variables
  process.env = Object.assign(process.env, {
    JWT_SECRET_KEY: 'asdf',
    NODE_ENV: 'test',
  });

  mongo = await MongoMemoryServer.create();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }

  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = () => {
  const payload = {
    id: 'asdfasdf',
    email: 'test@test.com',
  }

  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY!);
  const sessionJSON = JSON.stringify({ jwt: token });
  const base64 = Buffer.from(sessionJSON).toString('base64');

  return [`session=${base64}`];
}