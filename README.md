# BGSTM Playwright Frameworks

[![License: Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)
[![Status: Early Development](https://img.shields.io/badge/status-early%20development-orange.svg)](#status)

> 🚧 **Early development.** APIs and package names will change. Built in the open — feedback and PRs welcome.

A monorepo of **opinionated, domain-specific Playwright automation frameworks** with native traceability into [BGSTM](https://github.com/bg-playground/BGSTM).

Most Playwright starters are generic. These aren't. Each domain pack ships with:

- Pre-built page objects for the common entities of that domain (e.g. CRM: Lead, Opportunity, Account)
- Realistic test data factories
- Multi-step workflow helpers
- BGSTM-native reporting — every test result, step, and artifact is traceable back to a BGSTM requirement and test case

## Packages

| Package | Description | Status |
|---|---|---|
| [`@bgstm/playwright-core`](./packages/core) | Shared fixtures, base POM, BGSTM reporter | 🚧 Stub |
| [`@bgstm/domain-crm`](./packages/domain-crm) | CRM domain pack (Leads, Opportunities, Accounts) | 🚧 Stub |
| [`@bgstm/domain-accounting`](./packages/domain-accounting) | Accounting domain pack (Ledgers, Journals, Reconciliations) | 🚧 Stub |

> 💼 **Looking for regulated-industry packs** (Healthcare/HIPAA, Financial/SOX, GxP)? Those are available as part of [NAT](https://nat-testing.io) — the managed test execution platform built around BGSTM.

## Quick start

```bash
# Scaffold a new project (coming soon)
npm create bgstm-playwright@latest my-tests -- --domain=crm

# Or install packages directly
pnpm add -D @bgstm/playwright-core @bgstm/domain-crm
```

```ts
// playwright.config.ts
import { defineConfig } from '@playwright/test';
import { bgstmReporter } from '@bgstm/playwright-core/reporter';

export default defineConfig({
  reporter: [bgstmReporter({ baseUrl: process.env.BGSTM_URL, token: process.env.BGSTM_TOKEN })],
  // ...
});
```

```ts
// tests/lead.spec.ts
import { test, expect } from '@bgstm/domain-crm';

test('create a lead and convert to opportunity', async ({ leadsPage, opportunitiesPage }) => {
  const lead = await leadsPage.create({ name: 'Acme Corp', value: 50000 });
  await leadsPage.convert(lead.id);
  await expect(opportunitiesPage.byLeadId(lead.id)).toBeVisible();
});
```

## How it relates to BGSTM and NAT

```
BGSTM            ← methodology + traceability platform (open-source)
   ▲
   │ reports to via the BGSTM Reporter API
   │
This repo        ← Playwright execution scaffolding (open-source, Apache-2.0)
   ▲
   │ runs at scale on
   │
NAT              ← managed execution + AI-adaptive testing (commercial)
```

Read more: [BGSTM integration design](./docs/bgstm-integration.md)

## Example: crm-example

The [`examples/crm-example`](./examples/crm-example) directory is a minimal Playwright project that exercises the full reporter pipeline against a live BGSTM instance.

It contains exactly three tests (1 pass / 1 fail / 1 skip) — the failing test is **intentional** and is the artifact-upload smoke proof for the BGSTM step-2 CI job.

### Required environment variables

| Variable | Description |
|---|---|
| `BGSTM_API_URL` | Base URL of the BGSTM instance (e.g. `https://bgstm.example.com`) |
| `BGSTM_API_TOKEN` | Runner token (format: `bgstm_runner_…`) |
| `BGSTM_PROJECT_ID` | BGSTM project UUID to report results into |
| `GITHUB_SHA` | Commit SHA under test (set automatically in GitHub Actions) |
| `GITHUB_REF_NAME` | Branch name (set automatically in GitHub Actions) |

When `BGSTM_API_URL` is unset the reporter is skipped and only the `list` reporter runs.

```bash
cd examples/crm-example
BGSTM_API_URL=https://bgstm.example.com \
BGSTM_API_TOKEN=bgstm_runner_… \
BGSTM_PROJECT_ID=<uuid> \
pnpm test
```

## Development

```bash
pnpm install
pnpm build
pnpm test
pnpm -r --filter @bgstm/domain-crm test:e2e
```

Requires Node ≥ 20 and pnpm ≥ 9.

## Contributing

We welcome PRs! See [CONTRIBUTING.md](./CONTRIBUTING.md). For new domain pack proposals, please open a [Domain Pack Proposal](./.github/ISSUE_TEMPLATE/domain-pack-proposal.yml) issue first.

## License

Apache-2.0 — see [LICENSE](./LICENSE).

## Related

- [BGSTM](https://github.com/bg-playground/BGSTM) — methodology + traceability platform
- [NAT](https://nat-testing.io) — managed execution platform powered by BGSTM
- [BGSTM Reporter API contract (#291)](https://github.com/bg-playground/BGSTM/issues/291) — the integration spec this repo implements
