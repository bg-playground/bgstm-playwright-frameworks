import { describe, expect, it } from 'vitest';

import {
  makeAppointment,
  makeAvailabilitySlot,
  makeCallTranscript,
  makeContact,
  makeInboundCall,
  makeLead,
} from '../src/index.js';

describe('@bgstm/domain-saas-workflows factories', () => {
  it('builds inbound call and transcript defaults with overrides', () => {
    const call = makeInboundCall({ requestedService: 'Reschedule appointment' });
    const transcript = makeCallTranscript({ callId: call.id });

    expect(call.requestedService).toBe('Reschedule appointment');
    expect(transcript.callId).toBe(call.id);
    expect(transcript.capturedIntent?.name).toBe('book_appointment');
  });

  it('builds availability and appointment defaults with overrides', () => {
    const slot = makeAvailabilitySlot({ timezone: 'UTC' });
    const appointment = makeAppointment({ slotId: slot.id, confirmationChannel: 'email' });

    expect(slot.timezone).toBe('UTC');
    expect(appointment.slotId).toBe(slot.id);
    expect(appointment.confirmationChannel).toBe('email');
  });

  it('builds contact and lead defaults with overrides', () => {
    const contact = makeContact({ lifecycleStage: { key: 'qualified', label: 'Qualified' } });
    const lead = makeLead({ contactId: contact.id, status: 'working' });

    expect(contact.lifecycleStage?.key).toBe('qualified');
    expect(lead.contactId).toBe(contact.id);
    expect(lead.status).toBe('working');
  });
});
