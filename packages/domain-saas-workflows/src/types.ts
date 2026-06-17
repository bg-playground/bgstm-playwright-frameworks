export interface Intent {
  name: string;
  confidence?: number;
  channel?: 'voice' | 'sms' | 'email';
}

export interface LifecycleStage {
  key: string;
  label: string;
}

export interface InboundCall {
  id: string;
  fromNumber: string;
  toNumber: string;
  receivedAt: string;
  callerName?: string;
  requestedService?: string;
}

export interface CallTranscript {
  id: string;
  callId: string;
  transcript: string;
  summary?: string;
  capturedIntent?: Intent;
}

export interface AvailabilitySlot {
  id: string;
  startsAt: string;
  endsAt: string;
  timezone: string;
  agentId?: string;
}

export interface Appointment {
  id: string;
  slotId: string;
  contactId: string;
  status: 'booked' | 'rescheduled' | 'cancelled';
  confirmationChannel?: 'sms' | 'email';
}

export interface Contact {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  source?: 'call' | 'web' | 'manual';
  lifecycleStage?: LifecycleStage;
}

export interface Lead {
  id: string;
  contactId: string;
  sourceCallId?: string;
  status: 'new' | 'working' | 'qualified';
}
