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

import { test, expect } from '@bgstm/domain-accounting';

const DEMO_URL = process.env.BGSTM_DEMO_URL;

test.describe('Ledger page', () => {
  test.skip(!DEMO_URL, 'Set BGSTM_DEMO_URL to run accounting example tests');

  test('displays ledger list', async ({ ledgerPage, page }) => {
    test.info().annotations.push({ type: 'bgstm:requirement', description: 'REQ-ACC-INVOICE-LIST' });
    await ledgerPage.navigate();
    await expect(page).toHaveURL(/ledgers/);
    expect.soft(await page.title()).toBeTruthy();
  });
});

test.describe('Journal page', () => {
  test.skip(!DEMO_URL, 'Set BGSTM_DEMO_URL to run accounting example tests');

  test('displays journal entry list', async ({ journalPage, page }) => {
    test.info().annotations.push({ type: 'bgstm:requirement', description: 'REQ-ACC-JOURNAL-CREATE' });
    await journalPage.navigate();
    await expect(page).toHaveURL(/journals/);
  });
});
