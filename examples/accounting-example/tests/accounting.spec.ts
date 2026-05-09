import { test, expect } from '@bgstm/domain-accounting';

test('ledger page is navigable', async ({ ledgerPage, page }) => {
  expect(page).toBeDefined();
  expect(ledgerPage).toBeDefined();
  expect(typeof ledgerPage.navigate).toBe('function');
  expect(typeof ledgerPage.filter).toBe('function');
  expect(typeof ledgerPage.openEntry).toBe('function');
});

test('journal page has create/edit/post methods', async ({ journalPage }) => {
  expect(typeof journalPage.create).toBe('function');
  expect(typeof journalPage.edit).toBe('function');
  expect(typeof journalPage.post).toBe('function');
});
