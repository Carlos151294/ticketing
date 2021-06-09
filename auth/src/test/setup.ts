import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import app from '../app';

declare global {
  namespace NodeJS {
    interface Global {
      signup(): Promise<string[]>
    }
  }
}

let mongo: any;
// Run before all Tests
beforeAll(async () => {
  // Set Env Variables
  process.env.JWT_SECRET_KEY = 'asdui';

  // Create mongo in-memory instance
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  // Set mongoose connection to mongo instance
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Run before each Test
beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  // Delete all data
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signup = async () => {
  const email = 'carlos@gmail.com';
  const password = '1234';

  const response = await request(app)
    .post('/api/users/signup')
    .send({ email, password })
    .expect(201);

  return response.get('Set-Cookie');
};
