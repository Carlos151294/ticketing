import express from 'express';
import { currentUserHandler } from '@cfntickets/common';

const router = express.Router();

router.get('/api/users/currentuser', currentUserHandler, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
