import type { Appointment, AvailabilitySlot } from '../types.js';

export const makeAvailabilitySlot = (overrides: Partial<AvailabilitySlot> = {}): AvailabilitySlot => ({
  id: 'slot-001',
  startsAt: '2026-01-02T16:00:00.000Z',
  endsAt: '2026-01-02T16:30:00.000Z',
  timezone: 'America/New_York',
  agentId: 'agent-001',
  ...overrides,
});

export const makeAppointment = (overrides: Partial<Appointment> = {}): Appointment => ({
  id: 'appt-001',
  slotId: 'slot-001',
  contactId: 'contact-001',
  status: 'booked',
  confirmationChannel: 'sms',
  ...overrides,
});
