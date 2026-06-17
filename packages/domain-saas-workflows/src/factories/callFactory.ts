import type { CallTranscript, InboundCall } from '../types.js';

export const makeInboundCall = (overrides: Partial<InboundCall> = {}): InboundCall => ({
  id: 'call-001',
  fromNumber: '+15551230001',
  toNumber: '+15550000000',
  receivedAt: '2026-01-01T15:00:00.000Z',
  callerName: 'Taylor Prospect',
  requestedService: 'New appointment',
  ...overrides,
});

export const makeCallTranscript = (overrides: Partial<CallTranscript> = {}): CallTranscript => ({
  id: 'transcript-001',
  callId: 'call-001',
  transcript: 'Caller needs to book an appointment for next week.',
  summary: 'Inbound caller requested a new appointment.',
  capturedIntent: {
    name: 'book_appointment',
    confidence: 0.91,
    channel: 'voice',
  },
  ...overrides,
});
