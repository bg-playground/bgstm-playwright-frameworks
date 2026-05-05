import { test as base } from '@bgstm/playwright-core';
import { LeadPage } from '../pages/lead.page.js';
import { OpportunityPage } from '../pages/opportunity.page.js';
import { AccountPage } from '../pages/account.page.js';
import { ContactPage } from '../pages/contact.page.js';

type CrmFixtures = {
  leadsPage: LeadPage;
  opportunitiesPage: OpportunityPage;
  accountsPage: AccountPage;
  contactsPage: ContactPage;
};

export const test = base.extend<CrmFixtures>({
  leadsPage: async ({ page }, use) => {
    await use(new LeadPage(page));
  },
  opportunitiesPage: async ({ page }, use) => {
    await use(new OpportunityPage(page));
  },
  accountsPage: async ({ page }, use) => {
    await use(new AccountPage(page));
  },
  contactsPage: async ({ page }, use) => {
    await use(new ContactPage(page));
  },
});

export { expect } from '@playwright/test';
