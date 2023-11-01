import request from 'supertest';
import { app } from '../../app';

describe('POST /api/users/signup', () => {
  it('returns a 201 status code and a JWT token on successful signup', async () => {
    const email = 'test@gmail.com';
    const password = 'password';

    const response = await request(app)
      .post('/api/users/signup')
      .send({ email, password })
      .expect(201);

    expect(response.body.email).toEqual(email);
    expect(response.body).toHaveProperty('id');
  });

  it('returns a 400 status code with an invalid email', async () => {
    const email = 'test';
    const password = 'password';

    const response = await request(app)
      .post('/api/users/signup')
      .send({ email, password })
      .expect(400);

    expect(response.body.errors[0].message).toEqual('Email must be valid');
  });

  it('returns a 400 status code with an invalid password', async () => {
    const email = 'test@test.com';
    const password = '';

    const response = await request(app)
      .post('/api/users/signup')
      .send({ email, password })
      .expect(400);

    expect(response.body.errors[0].message).toEqual(
      'Password must be between 4 and 20 characters'
    );
  });
  it('should not allow duplicate emails', async () => {
    const email = 'test@gmail.com';
    const password = 'password';

    const response = await request(app)
      .post('/api/users/signup')
      .send({ email, password })
      .expect(400);

    expect(response.body.errors[0].message).toEqual('Email in use');
  })

  it('sets a cookie after successful signup', async () => {
    const email = 'test@test.com';
    const password = 'password';

    const response = await request(app)
      .post('/api/users/signup')
      .send({ email, password })
      .expect(201);

    expect(response.get('Set-Cookie')).toBeDefined();
  });
});

describe('POST /api/users/signin', () => {
  it('returns a 200 status code and a JWT token on successful signin', async () => {
    const email = 'test@gmail.com';
    const password = 'password';

    const response = await request(app)
      .post('/api/users/signin')
      .send({ email, password })
      .expect(200);

    expect(response.body.email).toEqual(email);
    expect(response.body).toHaveProperty('id');
    expect(response.get('Set-Cookie')).toBeDefined();
  });

  it('returns a 400 status code with an invalid email', async () => {
    const email = 'test';
    const password = 'password';

    const response = await request(app)
      .post('/api/users/signin')
      .send({ email, password })
      .expect(400);

    expect(response.body.errors[0].message).toEqual('Email must be valid');
  });

  it('returns a 400 status code with an invalid password', async () => {
    const email = 'test@gmail.com';
    const password = '';

    const response = await request(app)
      .post('/api/users/signin')
      .send({ email, password })
      .expect(400);

    expect(response.body.errors[0].message).toEqual(
      'You must supply a password'
    );
    });

  it('returns a 400 status code with an incorrect password', async () => {
    const email = 'test@gmail.com';
    const password = 'passwordss';

    const response = await request(app)
      .post('/api/users/signin')
      .send({ email, password })
      .expect(400);

    expect(response.body.errors[0].message).toEqual('Invalid credentials');
  });

  it('returns a 400 status code with an incorrect email', async () => {
    const email = 'test@yahoo.fr';
    const password = 'password';

    const response = await request(app)
      .post('/api/users/signin')
      .send({ email, password })
      .expect(400);

    expect(response.body.errors[0].message).toEqual('Invalid credentials');
  });
});


describe('POST /api/users/signout', () => {
  it('returns a 200 status code and clears the cookie', async () => {
    const response = await request(app)
      .post('/api/users/signout')
      .send({})
      .expect(200);

    expect(response.get('Set-Cookie')).toBeDefined();
    expect(response.body.message).toEqual('signed out successfully');
  }
  );
});

describe('GET /api/users/currentuser', () => {
  it('returns a 401 status code if user is not authenticated', async () => {
    const response = await request(app)
      .get('/api/users/currentuser')
      .send();

    expect(response.status).toEqual(401);
  });

  it('returns a 200 status code and the current user details if user is authenticated', async () => {
    const cookie = await global.signin();
    const response = await request(app)
      .get('/api/users/currentuser')
      .set('Cookie', cookie)
      .send();

    expect(response.status).toEqual(200);
    expect(response.body.currentUser.email).toEqual('test@mail.com');
  });
});
