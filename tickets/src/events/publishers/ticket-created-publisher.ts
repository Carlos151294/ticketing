import { Publisher, Subjects, TicketCreatedEvent } from "@cfntickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}