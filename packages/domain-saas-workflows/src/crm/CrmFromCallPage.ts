import type { Lead, LifecycleStage } from '../types.js';

export class CrmFromCallPage {
  /**
   * Creates a lead from a call transcript reference.
   */
  async createLeadFromCall(_callTranscriptRef: string): Promise<Lead> {
    throw new Error('Not yet implemented — stub');
  }

  /**
   * Enriches a contact profile from an external enrichment source.
   */
  async enrichContact(_contactId: string, _enrichmentSource: string): Promise<void> {
    throw new Error('Not yet implemented — stub');
  }

  /**
   * Transitions a contact through lifecycle stages.
   */
  async transitionLifecycle(_contactId: string, _stage: LifecycleStage): Promise<void> {
    throw new Error('Not yet implemented — stub');
  }

  /**
   * Asserts a call record is linked to the expected contact.
   */
  async assertCallLinkedToContact(_callId: string, _contactId: string): Promise<void> {
    throw new Error('Not yet implemented — stub');
  }
}
