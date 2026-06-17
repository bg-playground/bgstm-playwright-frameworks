// @ts-nocheck
import { test, expect } from '@playwright/test';
import { ReceptionistPage, SchedulingPage, makeInboundCall } from '@bgstm/domain-saas-workflows';

test(
  'books an appointment from an inbound AI receptionist call',
  { annotation: { type: 'bgstm:requirement', description: 'REQ-SAAS-WF-001' } },
  async ({ page }) => {
    const receptionist = new ReceptionistPage(page);
    const scheduling = new SchedulingPage(page);

    await receptionist.simulateInboundCall(makeInboundCall());
    await receptionist.assertIntentCaptured({ name: 'book_appointment' });
    await scheduling.openAvailability('2026-01-01');
    await scheduling.assertConfirmationSent('sms');

    await expect(page).toBeDefined();
  },
);
