import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { User } from '../models/user';
import { BadRequestError } from '../errors/bad-request-error';
import { validationHandler } from '../middlewares/validation-handler';

const router = express.Router();

const validationChain = [
  body('email')
    .isEmail()
    .withMessage('Email must be valid'),
  body('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Password must be between 4 and 20 characters')
];

router.post('/api/users/signup', 
  validationChain, 
  validationHandler,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('Email in use');
    }

    const user = User.build({ email, password });
    await user.save();

    // Generate JWT
    const userJwt = jwt.sign({
      id: user.id,
      email: user.email
    }, process.env.JWT_SECRET_KEY!);

    // Store it on session, in Set-Cookie response header
    req.session = {
      jwt: userJwt
    }; 

    res.status(201).send(user);
  }
);

export { router as signupRouter };