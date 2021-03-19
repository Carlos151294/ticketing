import request from 'supertest';

import app from '../../app';

it('responds with details about the current user', async () => {
  const cookie = await global.signup();
  
  // Then, get current user data
  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .expect(200);

  expect(response.body.currentUser.email).toEqual('carlos@gmail.com');
});

it('responds with null if not authenticated', async () => {  
  const response = await request(app)
    .get('/api/users/currentuser')
    .expect(200);
    
  expect(response.body.currentUser).toBeNull()
});