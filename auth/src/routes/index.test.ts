import jwt from 'jsonwebtoken';
import { secret } from '../config';
import { User } from '../models/user';
import { app } from '../app';
import request from 'supertest';

describe('POST /api/users/signup', () => {
  it('returns a 201 status code and a JWT token on successful signup', async () => {
    const email = 'test@test.com';
    const password = 'password';

    const response = await request(app)
      .post('/api/users/signup')
      .send({
        email,
        password,
      })
      .expect(201);

    const user = await User.findOne({ email });
    expect(user).toBeDefined();

    const payload = { id: user!.id, email: user!.email };
    const token = jwt.sign(payload, secret);

    expect(response.body.token).toEqual(token);
  });
});