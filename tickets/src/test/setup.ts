import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';

import app from '../app';

declare global {
  namespace NodeJS {
    interface Global {
      signin(): string[];
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

global.signin = () => {
  // Build a JWT payload. { id, email }
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'carlos@test.com'
  };

  // Create the JWT!
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY!)

  // Build Session Object { jwt: MY_JWT }
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJson = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJson).toString('base64');

  // Return a string thats the cookie with the encoded data
  return [`express:sess=${base64}`];
};
