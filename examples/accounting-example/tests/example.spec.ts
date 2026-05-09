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
//
// Demonstrates extending the @bgstm/domain-accounting fixture chain with a
// consumer-level fixture. Run with BGSTM_DEMO_URL set.

import { test as accountingTest, expect } from '@bgstm/domain-accounting';

// Consumer extends accounting fixtures with their own context
const test = accountingTest.extend<{ tenantId: string }>({
  tenantId: async ({}, use) => {
    await use(process.env.ACCOUNTING_TENANT_ID ?? 'demo-tenant');
  },
});

const DEMO_URL = process.env.BGSTM_DEMO_URL;

test.describe('Extended fixture composition', () => {
  test.skip(!DEMO_URL, 'Set BGSTM_DEMO_URL to run accounting example tests');

  test('ledger page is available with tenant context', async ({ ledgerPage, tenantId }) => {
    test.info().annotations.push({ type: 'bgstm:requirement', description: 'REQ-ACC-LEDGER-FILTER' });
    expect(tenantId).toBeTruthy();
    expect(ledgerPage).toBeDefined();
    // In a real suite: await ledgerPage.navigate(); then assert tenant-scoped content
  });
});
