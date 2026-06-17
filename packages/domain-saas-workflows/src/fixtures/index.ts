import { base } from '@bgstm/playwright-core';

import { CrmFromCallPage } from '../crm/CrmFromCallPage.js';
import { ReceptionistPage } from '../receptionist/ReceptionistPage.js';
import { SchedulingPage } from '../scheduling/SchedulingPage.js';

type SaasWorkflowFixtures = {
  receptionistPage: ReceptionistPage;
  schedulingPage: SchedulingPage;
  crmFromCallPage: CrmFromCallPage;
};

export const test = base.extend<SaasWorkflowFixtures>({
  receptionistPage: async ({ page }, use) => {
    await use(new ReceptionistPage(page));
  },
  schedulingPage: async ({ page }, use) => {
    await use(new SchedulingPage(page));
  },
  crmFromCallPage: async ({ page }, use) => {
    await use(new CrmFromCallPage(page));
  },
});

export { expect } from '@playwright/test';
