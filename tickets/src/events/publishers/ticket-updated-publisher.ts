import { Publisher, Subjects, TicketUpdatedEvent } from '@kandy-peter/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated
}