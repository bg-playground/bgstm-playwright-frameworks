import { BasePage } from '@bgstm/playwright-core';
import type { Page } from '@playwright/test';

import type { InboundCall, Intent } from '../types.js';

export class ReceptionistPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to the AI receptionist workspace for call-handling workflows.
   */
  async navigate(): Promise<void> {
    throw new Error('Not yet implemented — stub');
  }

  /**
   * Simulate an inbound call payload entering the receptionist queue, including
   * caller identity and requested service details.
   */
  async simulateInboundCall(_payload: InboundCall): Promise<void> {
    throw new Error('Not yet implemented — stub');
  }

  /**
   * Assert that the active call was routed into the expected queue after
   * automated intent capture and triage.
   */
  async assertCallRoutedToQueue(_queueName: string): Promise<void> {
    throw new Error('Not yet implemented — stub');
  }

  /**
   * Assert that the receptionist captured the expected caller intent from the
   * conversation transcript or live call analysis.
   */
  async assertIntentCaptured(_intent: Intent): Promise<void> {
    throw new Error('Not yet implemented — stub');
  }

  /**
   * Transfer the current call to a named human agent when the workflow requires
   * escalation beyond the automated receptionist.
   */
  async transferToHuman(_agentId: string): Promise<void> {
    throw new Error('Not yet implemented — stub');
  }

  /**
   * End the current inbound call after routing, booking, or escalation is
   * complete.
   */
  async endCall(): Promise<void> {
    throw new Error('Not yet implemented — stub');
  }
}
