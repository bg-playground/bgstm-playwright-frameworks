import type { Contact, Lead } from '../types.js';

export function makeContact(overrides: Partial<Contact> = {}): Contact {
  return {
    id: 'contact_001',
    fullName: 'Jordan Carter',
    email: 'jordan.carter@example.com',
    phone: '+15555550987',
    lifecycleStage: { name: 'new' },
    ...overrides,
  };
}

export function makeLead(overrides: Partial<Lead> = {}): Lead {
  return {
    id: 'lead_001',
    source: 'inbound-call',
    contactId: 'contact_001',
    status: 'new',
    ...overrides,
  };
}
