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

### Base Fixtures

```ts
import { base } from '@bgstm/playwright-core';
const test = base.extend({ /* your fixtures */ });
```

## API

See [source](./src/index.ts) for the full API surface. This package is in early development.

## License

Apache-2.0
