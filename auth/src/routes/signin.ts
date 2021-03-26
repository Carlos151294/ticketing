import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { BadRequestError, validationHandler } from '@cfntickets/common';

import { User } from '../models/user';
import { Password } from '../utils/password';

const router = express.Router();

const validationChain = [
  body('email')
    .isEmail()
    .withMessage('Email must be valid'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('You must supply a password')
];

router.post('/api/users/signin', 
  validationChain,
  validationHandler,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }

    const passwordsMatch = await Password.compare(existingUser.password, password);
    if (!passwordsMatch) {
      throw new BadRequestError('Invalid credentials');
    }

    // Generate JWT
    const userJwt = jwt.sign({
      id: existingUser.id,
      email: existingUser.email
    }, process.env.JWT_SECRET_KEY!);

    // Store it on session
    req.session = {
      jwt: userJwt
    }; 

    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };