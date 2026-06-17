export interface Intent {
  name: string;
  confidence?: number;
}

export interface LifecycleStage {
  name: 'new' | 'qualified' | 'active' | 'inactive' | 'churned';
}

export interface InboundCall {
  id: string;
  fromNumber: string;
  startedAt: string;
  channel?: 'voice' | 'web-call';
}

export interface CallTranscript {
  id: string;
  callId: string;
  summary: string;
  intent?: Intent;
}

export interface AvailabilitySlot {
  id: string;
  startsAt: string;
  endsAt: string;
  timezone: string;
}

export interface Appointment {
  id: string;
  slotId: string;
  contactId: string;
  status: 'booked' | 'rescheduled' | 'cancelled';
}

export interface Contact {
  id: string;
  fullName: string;
  email?: string;
  phone?: string;
  lifecycleStage: LifecycleStage;
}

export interface Lead {
  id: string;
  source: 'inbound-call' | 'web' | 'referral';
  contactId: string;
  status: 'new' | 'contacted' | 'qualified' | 'lost';
}
