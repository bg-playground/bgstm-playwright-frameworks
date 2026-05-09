# @bgstm/domain-accounting

> Accounting domain pack for Playwright with reusable page objects and fixtures for ledger and journal workflows.

[![Status: Active](https://img.shields.io/badge/status-active-brightgreen.svg)](#)

Implemented in [#5](https://github.com/bg-playground/bgstm-playwright-frameworks/issues/5)

See [examples/accounting-example](../../examples/accounting-example) for a runnable Playwright project using this package.

## Usage

```ts
import { base as core } from '@bgstm/playwright-core';
import { test as accountingTest, expect } from '@bgstm/domain-accounting';

// core (base) -> accounting (domain) -> spec
const test = accountingTest.extend<{
  tenantId: string;
}>({
  tenantId: async ({}, use) => {
    await use('tenant-local');
  },
});

test('ledger page is available', async ({ ledgerPage }) => {
  expect(ledgerPage).toBeDefined();
});
```

## Entities

| Entity | Page Object | Status |
| --- | --- | --- |
| Ledger | `LedgerPage` | Active |
| Journal | `JournalPage` | Active |
| Reconciliation | `ReconciliationPage` | Stub (`navigate()` only in v0.1) |

## License

Licensed under the Apache License, Version 2.0.
