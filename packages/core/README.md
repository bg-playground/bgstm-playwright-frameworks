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
import { bgstmReporter } from '@bgstm/playwright-core/reporter';

export default defineConfig({
  reporter: [bgstmReporter({ baseUrl: process.env.BGSTM_URL, token: process.env.BGSTM_TOKEN })],
});
```

### Base Fixtures

```ts
import { base } from '@bgstm/playwright-core';
const test = base.extend({ /* your fixtures */ });
```

## API

See [source](./src/index.ts) for the full API surface. This package is in early development.

## License

Apache-2.0
