import type { Appointment, AvailabilitySlot } from '../types.js';

export function makeAvailabilitySlot(overrides: Partial<AvailabilitySlot> = {}): AvailabilitySlot {
  return {
    id: 'slot_001',
    startsAt: new Date('2026-01-01T15:00:00Z').toISOString(),
    endsAt: new Date('2026-01-01T15:30:00Z').toISOString(),
    timezone: 'UTC',
    ...overrides,
  };
}

export function makeAppointment(overrides: Partial<Appointment> = {}): Appointment {
  return {
    id: 'appt_001',
    slotId: 'slot_001',
    contactId: 'contact_001',
    status: 'booked',
    ...overrides,
  };
}
