import { Publisher } from "../../../ticket-common-package/src/events/base-publisher";
import { Subjects } from "../../../ticket-common-package/src/events/subjects";
import { TicketCreatedEvent } from "../../../ticket-common-package/src/events/ticket-created-event";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  // subject: Subjects.TicketCreated = Subjects.TicketCreated;
  readonly subject = Subjects.TicketCreated;
}