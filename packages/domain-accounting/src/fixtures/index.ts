// Copyright 2024 bg-playground
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
