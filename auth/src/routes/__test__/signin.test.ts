import request from 'supertest';

import app from '../../app';

it('fails when email does not exist', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'carlos@gmail.com',
      password: '1234'
    })
    .expect(400);
});

it('fails when password is incorrect', async () => {
  // First Signup to create a user with a given password
  // Then, Signin with different password
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'carlos@gmail.com',
      password: '1234'
    })
    .expect(201);

  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'carlos@gmail.com',
      password: 'password'
    })
    .expect(400);
});


it('responds with a cookie when given valid credentials', async () => {
  // First Signup to create a user with a given password
  // Then, Signin and validate cookie is set
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'carlos@gmail.com',
      password: '1234'
    })
    .expect(201);

  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'carlos@gmail.com',
      password: '1234'
    })
    .expect(200);

  expect(response.get('Set-Cookie')).toBeDefined();
});
