# BGSTM Integration

This document explains how `@bgstm/playwright-core` integrates with the BGSTM Reporter API.

## Architecture

```
Your Playwright tests
  └── @bgstm/domain-crm (or other domain pack)
       └── @bgstm/playwright-core
            └── BgstmReporter  ──► BGSTM Reporter API (#291)
                                        └── BGSTM traceability platform
```

## Reporter API contract

The reporter implements the contract defined in [BGSTM issue #291](https://github.com/bg-playground/BGSTM/issues/291).

Key integration points:

| Event | API call |
|-------|----------|
| Test run starts | `POST /api/runs` |
| Test result recorded | `POST /api/runs/:runId/results` |
| Test run completes | `PATCH /api/runs/:runId` |

## Configuration

```ts
// playwright.config.ts
import { defineConfig } from '@playwright/test';
import { bgstmReporter } from '@bgstm/playwright-core/reporter';

export default defineConfig({
  reporter: [
    bgstmReporter({
      baseUrl: process.env.BGSTM_URL!,   // e.g. https://bgstm.example.com
      token: process.env.BGSTM_TOKEN!,   // BGSTM API token
    }),
  ],
});
```

## Environment variables

| Variable | Description |
|----------|-------------|
| `BGSTM_URL` | Base URL of your BGSTM instance |
| `BGSTM_TOKEN` | BGSTM API token with write access |

## Status

The reporter is in early development. The API contract is being finalised in [BGSTM #291](https://github.com/bg-playground/BGSTM/issues/291). Contributions welcome!
