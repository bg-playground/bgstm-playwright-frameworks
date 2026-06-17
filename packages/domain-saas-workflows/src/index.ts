export { test, expect } from './fixtures/index.js';
export { CrmFromCallPage } from './crm/CrmFromCallPage.js';
export { ReceptionistPage } from './receptionist/ReceptionistPage.js';
export { SchedulingPage } from './scheduling/SchedulingPage.js';
export { makeAvailabilitySlot, makeAppointment, makeCallTranscript, makeContact, makeInboundCall, makeLead } from './factories/index.js';
export type {
  Appointment,
  AvailabilitySlot,
  CallTranscript,
  Contact,
  InboundCall,
  Intent,
  Lead,
  LifecycleStage,
} from './types.js';
