import type { CallTranscript, InboundCall, Intent } from '../types.js';

export function makeInboundCall(overrides: Partial<InboundCall> = {}): InboundCall {
  return {
    id: 'call_001',
    fromNumber: '+15555550123',
    startedAt: new Date('2026-01-01T10:00:00Z').toISOString(),
    channel: 'voice',
    ...overrides,
  };
}

export function makeCallTranscript(overrides: Partial<CallTranscript> = {}): CallTranscript {
  const defaultIntent: Intent = { name: 'book_appointment', confidence: 0.91 };

  return {
    id: 'tx_001',
    callId: 'call_001',
    summary: 'Caller requested next-week dental cleaning appointment.',
    intent: defaultIntent,
    ...overrides,
  };
}
