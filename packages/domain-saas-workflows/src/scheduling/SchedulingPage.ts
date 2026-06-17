import type { Appointment, AvailabilitySlot, Contact } from '../types.js';

export class SchedulingPage {
  /**
   * Opens availability for a specific date in the scheduler.
   */
  async openAvailability(_date: string): Promise<void> {
    throw new Error('Not yet implemented — stub');
  }

  /**
   * Books an appointment slot for the provided contact.
   */
  async bookAppointment(_slot: AvailabilitySlot, _contactRef: Pick<Contact, 'id'>): Promise<Appointment> {
    throw new Error('Not yet implemented — stub');
  }

  /**
   * Reschedules an appointment to a new slot.
   */
  async rescheduleAppointment(_apptId: string, _newSlot: AvailabilitySlot): Promise<void> {
    throw new Error('Not yet implemented — stub');
  }

  /**
   * Cancels an appointment with a reason visible in audit history.
   */
  async cancelAppointment(_apptId: string, _reason: string): Promise<void> {
    throw new Error('Not yet implemented — stub');
  }

  /**
   * Asserts booking confirmation was sent over the requested channel.
   */
  async assertConfirmationSent(_channel: 'sms' | 'email'): Promise<void> {
    throw new Error('Not yet implemented — stub');
  }
}
