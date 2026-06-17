import type { InboundCall, Intent } from '../types.js';
import type { Page } from '@playwright/test';

export class ReceptionistPage {
  constructor(_page: Page) {}

  /**
   * Simulates an inbound call entering the AI receptionist flow.
   */
  async simulateInboundCall(_payload: InboundCall): Promise<void> {
    throw new Error('Not yet implemented — stub');
  }

  /**
   * Asserts the call was routed to the expected queue.
   */
  async assertCallRoutedToQueue(_queueName: string): Promise<void> {
    throw new Error('Not yet implemented — stub');
  }

  /**
   * Asserts the captured caller intent from the receptionist flow.
   */
  async assertIntentCaptured(_intent: Intent): Promise<void> {
    throw new Error('Not yet implemented — stub');
  }

  /**
   * Transfers the current call to a specific human agent.
   */
  async transferToHuman(_agentId: string): Promise<void> {
    throw new Error('Not yet implemented — stub');
  }

  /**
   * Ends the active inbound call session.
   */
  async endCall(): Promise<void> {
    throw new Error('Not yet implemented — stub');
  }
}
