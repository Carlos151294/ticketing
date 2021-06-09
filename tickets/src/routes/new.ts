import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuthHandler, validationHandler } from '@cfntickets/common';

import { Ticket } from '../models/ticket';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const validationChain = [
  body('title')
    .not()
    .isEmpty()
    .withMessage('Title is required'), 
  body('price')
    .isFloat({ gt: 0 })
    .withMessage('Price must be greater than 0'),
];

router.post(
  '/api/tickets',
  requireAuthHandler,
  validationChain,
  validationHandler,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id
    });
    // Save new Ticket in DB
    await ticket.save();

    // Publish Ticket Created Event
    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId
    });

    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
