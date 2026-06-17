import { BasePage } from '@bgstm/playwright-core';
import type { Page } from '@playwright/test';

import type { LifecycleStage } from '../types.js';

export class CrmFromCallPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to the CRM view used to create and enrich contacts directly from
   * receptionist call outcomes.
   */
  async navigate(): Promise<void> {
    throw new Error('Not yet implemented — stub');
  }

  /**
   * Create a new lead record from a call transcript reference captured during
   * the receptionist workflow.
   */
  async createLeadFromCall(_callTranscriptRef: string): Promise<void> {
    throw new Error('Not yet implemented — stub');
  }

  /**
   * Enrich an existing contact with data pulled from an external source such as
   * caller ID, firmographics, or prior CRM records.
   */
  async enrichContact(_contactId: string, _enrichmentSource: string): Promise<void> {
    throw new Error('Not yet implemented — stub');
  }

  /**
   * Transition a contact or lead into the next lifecycle stage after the call
   * outcome has been reviewed.
   */
  async transitionLifecycle(_contactId: string, _stage: LifecycleStage): Promise<void> {
    throw new Error('Not yet implemented — stub');
  }

  /**
   * Assert that a call record remains linked to the expected CRM contact for
   * downstream reporting and follow-up automation.
   */
  async assertCallLinkedToContact(_callId: string, _contactId: string): Promise<void> {
    throw new Error('Not yet implemented — stub');
  }
}
