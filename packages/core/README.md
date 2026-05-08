# @bgstm/playwright-core

> Shared fixtures, base POM utilities, and BGSTM reporter for Playwright.

[![Status: In Progress](https://img.shields.io/badge/status-in%20progress-orange.svg)](#)

## Installation

```bash
pnpm add -D @bgstm/playwright-core
```

## Usage

### BGSTM Reporter

```ts
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['@bgstm/playwright-core/reporter', {
      apiUrl: process.env.BGSTM_API_URL,
      apiToken: process.env.BGSTM_API_TOKEN,
      projectId: process.env.BGSTM_PROJECT_ID,
      tolerateOffline: true,
    }],
  ],
});
```

Environment variables used by the reporter:

- `BGSTM_API_URL`
- `BGSTM_API_TOKEN`
- `BGSTM_PROJECT_ID`

### Linking tests to requirements

Use Playwright annotations to associate a test with one or more BGSTM requirements. The reporter collects
all `bgstm:requirement` annotations on the test, trims their descriptions, and sends the non-empty values to BGSTM.

```ts
import { test } from '@playwright/test';

test(
  'login redirects to dashboard',
  { annotation: { type: 'bgstm:requirement', description: 'REQ-LOGIN-001' } },
  async ({ page }) => {
    await page.goto('/login');
  },
);
```

You can also push annotations at runtime with `test.info().annotations.push({ type: 'bgstm:requirement', description: 'REQ-LOGIN-001' })`.
Multiple requirement annotations per test are supported and preserved in declaration order.

BGSTM resolves these values against `requirements.external_id`. Unknown IDs are dropped silently and recorded in
the BGSTM audit log, so create the requirement in BGSTM first (for example via `POST /api/v1/requirements`) if you
need guaranteed linking. `auto_register_requirements` remains a server-side opt-in; this reporter does not send it.

### Base Fixtures

```ts
import { base } from '@bgstm/playwright-core';
const test = base.extend({ /* your fixtures */ });
```

## API

See [source](./src/index.ts) for the full API surface. This package is in early development.

## License

Apache-2.0
