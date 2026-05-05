# Writing a Domain Pack

Domain packs are npm packages that extend `@bgstm/playwright-core` with page objects, factories, and flows for a specific business domain.

## Before you start

Open a [Domain Pack Proposal](../.github/ISSUE_TEMPLATE/domain-pack-proposal.yml) issue to discuss your domain pack before implementing it.

## Structure

A domain pack lives in `packages/domain-<name>/` and follows this structure:

```
packages/domain-<name>/
  src/
    pages/           # Page object classes extending BasePage
    factories/       # Test data factories
    flows/           # Multi-step workflow helpers
    fixtures/        # Playwright fixture extensions
    index.ts         # Public API
  tests/             # Exemplar tests
  package.json
  tsconfig.json
  README.md
```

## Step 1: Create the package directory

```bash
mkdir -p packages/domain-myapp/src/{pages,factories,flows,fixtures} packages/domain-myapp/tests
```

## Step 2: Add package.json

Use `packages/domain-crm/package.json` as a template. Change `name` and `description`.

## Step 3: Implement page objects

Extend `BasePage` from `@bgstm/playwright-core`:

```ts
// src/pages/invoice.page.ts
import { BasePage } from '@bgstm/playwright-core';
import type { Page } from '@playwright/test';

export class InvoicePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async navigate() {
    await this.page.goto('/invoices');
    await this.waitForLoad();
  }

  async create(data: { amount: number; recipient: string }) {
    // implement creation flow
  }
}
```

## Step 4: Add fixtures

```ts
// src/fixtures/index.ts
import { test as base } from '@bgstm/playwright-core';
import { InvoicePage } from '../pages/invoice.page.js';

export const test = base.extend({
  invoicePage: async ({ page }, use) => {
    await use(new InvoicePage(page));
  },
});

export { expect } from '@playwright/test';
```

## Step 5: Export from index.ts

```ts
// src/index.ts
export { test, expect } from './fixtures/index.js';
export { InvoicePage } from './pages/invoice.page.js';
```

## Step 6: Write exemplar tests

Add tests in `tests/` that demonstrate the domain pack against a real (or demo) target application.

## Step 7: Add a changeset

```bash
pnpm changeset
```

Select `minor` for the new package.
