import { Publisher, Subjects, TicketCreatedEvent } from '@kandy-peter/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated
}