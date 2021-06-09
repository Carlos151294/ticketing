import { Publisher, Subjects, TicketUpdatedEvent } from "@cfntickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}