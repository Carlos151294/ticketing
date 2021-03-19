import request from 'supertest';

import app from '../../app';

it('signs out a user and removes cookie session', async () => {
  // First Signup to create a user
  // Then, Signout and verify cookie is no loner defined
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'carlos@gmail.com',
      password: '1234'
    })
    .expect(201);

  const response = await request(app)
    .post('/api/users/signout')
    .send({})
    .expect(200);
    
  expect(response.get('Set-Cookie')[0]).toEqual(
    'express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
  );
});