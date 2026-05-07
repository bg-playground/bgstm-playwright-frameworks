// Apache-2.0
//
// This suite is intentionally one-pass / one-fail / one-skip.
// Do NOT "fix" the failing test — it is the artifact-upload smoke proof for
// the BGSTM step-2 CI job. The failing test exercises the screenshot-capture
// and case-result upload paths of BGSTMReporter.onTestEnd.

import { test, expect } from '@playwright/test';

test('passes — homepage loads', async ({ page }) => {
  test.info().annotations.push({ type: 'bgstm:requirement', description: 'REQ-CRM-HOMEPAGE' });
  await page.goto('https://playwright.dev/');
  await expect(page).toHaveTitle(/Playwright/);
});

test('fails — intentional assertion failure to exercise artifact upload', async ({ page }) => {
  test.info().annotations.push({ type: 'bgstm:requirement', description: 'REQ-CRM-FAIL-PROBE' });
  await page.goto('https://playwright.dev/');
  await expect(page).toHaveTitle(
    'This title intentionally does not match — failure expected for smoke test',
  );
});

test.skip('skipped — exercises skip path', async () => {
  // intentionally empty
});
