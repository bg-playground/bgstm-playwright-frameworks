import type { Contact, Lead } from '../types.js';

export const makeContact = (overrides: Partial<Contact> = {}): Contact => ({
  id: 'contact-001',
  name: 'Taylor Prospect',
  phone: '+15551230001',
  email: 'taylor@example.com',
  source: 'call',
  lifecycleStage: {
    key: 'new',
    label: 'New',
  },
  ...overrides,
});

export const makeLead = (overrides: Partial<Lead> = {}): Lead => ({
  id: 'lead-001',
  contactId: 'contact-001',
  sourceCallId: 'call-001',
  status: 'new',
  ...overrides,
});
