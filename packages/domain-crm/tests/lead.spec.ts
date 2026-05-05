import { test, expect } from '../src/fixtures/index.js';

// Exemplar tests for the CRM domain pack.
// These are intentionally skipped until a target CRM application is configured.
test.skip('create a lead', async ({ leadsPage }) => {
  await leadsPage.navigate();
  const lead = await leadsPage.create({ name: 'Acme Corp', value: 50000 });
  expect(lead.id).toBeTruthy();
});

test.skip('convert a lead to opportunity', async ({ leadsPage, opportunitiesPage }) => {
  await leadsPage.navigate();
  const lead = await leadsPage.create({ name: 'Acme Corp', value: 50000 });
  await leadsPage.convert(lead.id);
  await expect(opportunitiesPage.byLeadId(lead.id)).toBeVisible();
});
