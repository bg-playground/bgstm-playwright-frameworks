import type { Page } from '@playwright/test';
import { describe, expect, it } from 'vitest';

import { CrmFromCallPage } from '../src/crm/CrmFromCallPage.js';
import { ReceptionistPage } from '../src/receptionist/ReceptionistPage.js';
import { SchedulingPage } from '../src/scheduling/SchedulingPage.js';

const page = {} as Page;

describe('@bgstm/domain-saas-workflows stubs', () => {
  it('documents receptionist stub behavior', async () => {
    const receptionistPage = new ReceptionistPage(page);

    await expect(receptionistPage.simulateInboundCall({ id: 'call-1', fromNumber: '1', toNumber: '2', receivedAt: 'now' })).rejects.toThrow(
      'Not yet implemented — stub',
    );
    await expect(receptionistPage.assertCallRoutedToQueue('appointments')).rejects.toThrow('Not yet implemented — stub');
    await expect(receptionistPage.assertIntentCaptured({ name: 'book_appointment' })).rejects.toThrow(
      'Not yet implemented — stub',
    );
    await expect(receptionistPage.transferToHuman('agent-7')).rejects.toThrow('Not yet implemented — stub');
    await expect(receptionistPage.endCall()).rejects.toThrow('Not yet implemented — stub');
  });

  it('documents scheduling stub behavior', async () => {
    const schedulingPage = new SchedulingPage(page);

    await expect(schedulingPage.openAvailability('2026-01-02')).rejects.toThrow('Not yet implemented — stub');
    await expect(
      schedulingPage.bookAppointment(
        { id: 'slot-1', startsAt: 'start', endsAt: 'end', timezone: 'UTC' },
        'contact-1',
      ),
    ).rejects.toThrow('Not yet implemented — stub');
    await expect(
      schedulingPage.rescheduleAppointment('appt-1', {
        id: 'slot-2',
        startsAt: 'start',
        endsAt: 'end',
        timezone: 'UTC',
      }),
    ).rejects.toThrow('Not yet implemented — stub');
    await expect(schedulingPage.cancelAppointment('appt-1', 'caller requested')).rejects.toThrow(
      'Not yet implemented — stub',
    );
    await expect(schedulingPage.assertConfirmationSent('sms')).rejects.toThrow('Not yet implemented — stub');
  });

  it('documents CRM-from-call stub behavior', async () => {
    const crmFromCallPage = new CrmFromCallPage(page);

    await expect(crmFromCallPage.createLeadFromCall('transcript-1')).rejects.toThrow('Not yet implemented — stub');
    await expect(crmFromCallPage.enrichContact('contact-1', 'clearbit')).rejects.toThrow('Not yet implemented — stub');
    await expect(crmFromCallPage.transitionLifecycle('contact-1', { key: 'qualified', label: 'Qualified' })).rejects.toThrow(
      'Not yet implemented — stub',
    );
    await expect(crmFromCallPage.assertCallLinkedToContact('call-1', 'contact-1')).rejects.toThrow(
      'Not yet implemented — stub',
    );
  });
});
