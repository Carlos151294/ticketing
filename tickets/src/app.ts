import express from 'express';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import 'express-async-errors';
import { errorHandler, NotFoundError, currentUserHandler } from '@cfntickets/common';

import { createTicketRouter } from './routes/__test__/new';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test'
}));
// Set currentUser prop if user is auth
app.use(currentUserHandler);

// Routers
app.use(createTicketRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export default app;