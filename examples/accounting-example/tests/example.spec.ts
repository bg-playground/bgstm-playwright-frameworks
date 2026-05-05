import { test, expect } from '@bgstm/domain-accounting';

// This is an exemplar test. Set ACCOUNTING_BASE_URL to point at your accounting application.
test.skip('navigate to ledgers', async ({ ledgerPage }) => {
  await ledgerPage.navigate();
  expect(ledgerPage).toBeDefined();
});
