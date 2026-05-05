# Getting Started with bgstm-playwright-frameworks

This guide walks you through setting up a new Playwright project using the BGSTM domain packs.

## Prerequisites

- Node.js >= 20
- pnpm >= 9

## Option 1: Scaffolder (coming soon)

```bash
npm create bgstm-playwright@latest my-tests -- --domain=crm
```

## Option 2: Manual setup

```bash
mkdir my-tests && cd my-tests
pnpm init
pnpm add -D @playwright/test @bgstm/playwright-core @bgstm/domain-crm
pnpm exec playwright install chromium
```

Create a `playwright.config.ts`:

```ts
import { defineConfig } from '@playwright/test';
import { bgstmReporter } from '@bgstm/playwright-core/reporter';

export default defineConfig({
  testDir: './tests',
  reporter: [
    ['list'],
    bgstmReporter({ baseUrl: process.env.BGSTM_URL!, token: process.env.BGSTM_TOKEN! }),
  ],
  use: {
    baseURL: process.env.APP_BASE_URL || 'http://localhost:3000',
  },
});
```

Create your first test in `tests/lead.spec.ts`:

```ts
import { test, expect } from '@bgstm/domain-crm';

test('create a lead', async ({ leadsPage }) => {
  await leadsPage.navigate();
  const lead = await leadsPage.create({ name: 'Acme Corp', value: 50000 });
  expect(lead.id).toBeTruthy();
});
```

Run your tests:

```bash
pnpm exec playwright test
```

## Next steps

- [BGSTM integration](./bgstm-integration.md) — how to wire the reporter into BGSTM
- [Writing a domain pack](./writing-a-domain-pack.md) — how to create your own domain pack
