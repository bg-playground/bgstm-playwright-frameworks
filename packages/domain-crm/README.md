# @bgstm/domain-crm

> CRM domain pack for Playwright — pre-built page objects, factories, and flows for Lead, Opportunity, Account, and Contact entities.

[![Status: In Progress](https://img.shields.io/badge/status-in%20progress-orange.svg)](#)

## Installation

```bash
pnpm add -D @bgstm/playwright-core @bgstm/domain-crm
```

## Usage

```ts
import { test, expect } from '@bgstm/domain-crm';

test('create a lead and convert to opportunity', async ({ leadsPage, opportunitiesPage }) => {
  const lead = await leadsPage.create({ name: 'Acme Corp', value: 50000 });
  await leadsPage.convert(lead.id);
  await expect(opportunitiesPage.byLeadId(lead.id)).toBeVisible();
});
```

## Entities

- **Leads** — `LeadPage`, `LeadFactory`
- **Opportunities** — `OpportunityPage`, `OpportunityFactory`
- **Accounts** — `AccountPage` _(factory planned)_
- **Contacts** — `ContactPage` _(factory planned)_

## License

Apache-2.0
