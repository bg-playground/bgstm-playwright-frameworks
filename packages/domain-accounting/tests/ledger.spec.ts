import { test, expect } from '../src/fixtures/index.js';

test.skip('navigate to ledgers', async ({ ledgerPage, page }) => {
  await ledgerPage.navigate();
  await expect(page).toHaveURL('/ledgers');
});
