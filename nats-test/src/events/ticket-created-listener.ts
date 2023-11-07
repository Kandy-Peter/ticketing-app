import { Message } from 'node-nats-streaming';
import { Listener } from '../../../ticket-common-package/src/events/base-listener';
import { TicketCreatedEvent } from '../../../ticket-common-package/src/events/ticket-created-event';
import { Subjects } from '../../../ticket-common-package/src/events/subjects';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = 'payments-service';

  onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    console.log('Event data!', data);

    msg.ack();
  }
}