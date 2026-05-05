import { test, expect } from '@bgstm/domain-crm';

// This is an exemplar test. Set CRM_BASE_URL to point at your CRM instance.
test.skip('create a lead', async ({ leadsPage }) => {
  await leadsPage.navigate();
  expect(leadsPage).toBeDefined();
});
