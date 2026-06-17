// @ts-nocheck
import { test } from '@playwright/test';

import { ReceptionistPage, makeInboundCall } from '../src/index.js';

test(
  'captures a booking intent from an inbound call',
  { annotation: { type: 'bgstm:requirement', description: 'REQ-AI-RECEPTIONIST-001' } },
  async ({ page }) => {
    const receptionistPage = new ReceptionistPage(page);
    const inboundCall = makeInboundCall({ requestedService: 'Initial consultation' });

    await receptionistPage.simulateInboundCall(inboundCall);
    await receptionistPage.assertIntentCaptured({ name: 'book_appointment', channel: 'voice' });
    await receptionistPage.assertCallRoutedToQueue('appointments');
  },
);
