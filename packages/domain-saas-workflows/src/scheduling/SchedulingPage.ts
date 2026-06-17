import { BasePage } from '@bgstm/playwright-core';
import type { Page } from '@playwright/test';

import type { AvailabilitySlot } from '../types.js';

export class SchedulingPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to the shared scheduling workspace used for availability lookup
   * and appointment lifecycle actions.
   */
  async navigate(): Promise<void> {
    throw new Error('Not yet implemented — stub');
  }

  /**
   * Open scheduling availability for a specific business date so an agent or
   * receptionist flow can choose an appointment slot.
   */
  async openAvailability(_date: string): Promise<void> {
    throw new Error('Not yet implemented — stub');
  }

  /**
   * Book an appointment into the selected slot for a known contact reference
   * captured during a receptionist or CRM workflow.
   */
  async bookAppointment(_slot: AvailabilitySlot, _contactRef: string): Promise<void> {
    throw new Error('Not yet implemented — stub');
  }

  /**
   * Reschedule an existing appointment into a new slot while preserving the
   * appointment identifier used across downstream systems.
   */
  async rescheduleAppointment(_apptId: string, _newSlot: AvailabilitySlot): Promise<void> {
    throw new Error('Not yet implemented — stub');
  }

  /**
   * Cancel an existing appointment and capture the cancellation reason for
   * auditability and follow-up workflows.
   */
  async cancelAppointment(_apptId: string, _reason: string): Promise<void> {
    throw new Error('Not yet implemented — stub');
  }

  /**
   * Assert that a booking confirmation was sent on the expected outbound
   * channel after an appointment mutation.
   */
  async assertConfirmationSent(_channel: 'sms' | 'email'): Promise<void> {
    throw new Error('Not yet implemented — stub');
  }
}
