import { base } from '@bgstm/playwright-core';
import { LedgerPage } from '../pages/ledger.page.js';
import { JournalPage } from '../pages/journal.page.js';
import { ReconciliationPage } from '../pages/reconciliation.page.js';

type AccountingFixtures = {
  ledgerPage: LedgerPage;
  journalPage: JournalPage;
  reconciliationPage: ReconciliationPage;
};

export const test = base.extend<AccountingFixtures>({
  ledgerPage: async ({ page }, use) => {
    await use(new LedgerPage(page));
  },
  journalPage: async ({ page }, use) => {
    await use(new JournalPage(page));
  },
  reconciliationPage: async ({ page }, use) => {
    await use(new ReconciliationPage(page));
  },
});

export { expect } from '@playwright/test';
