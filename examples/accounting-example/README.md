<!-- Copyright 2024 bg-playground

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. -->

# accounting-example

A realistic, idiomatic Playwright project demonstrating how to consume `@bgstm/playwright-core` and `@bgstm/domain-accounting` together — with BGSTM requirement annotations, fixture composition, and clean skip behaviour when no target app is available.

## Distinction from `crm-example`

`examples/crm-example` is the **BGSTM smoke fixture** — it is intentionally one-pass / one-fail / one-skip and is wired into step-2 CI to exercise the full reporter pipeline (artifact upload, screenshot capture, case-result upload).

This example is a **teaching example** — realistic, all-passing when `BGSTM_DEMO_URL` is set, and skipping cleanly when it is not. It shows idiomatic usage patterns for real project teams adopting `@bgstm/domain-accounting`.

## Quick start

```bash
# From the repo root
pnpm install
export BGSTM_DEMO_URL=http://your-accounting-app:3000
export ACCOUNTING_BASE_URL=http://your-accounting-app:3000
pnpm -F accounting-example smoke
```

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `BGSTM_DEMO_URL` | Yes (to run) | Target accounting application URL. Tests skip cleanly if unset. |
| `ACCOUNTING_BASE_URL` | No | Playwright `baseURL`. Defaults to `http://localhost:3000`. |
| `BGSTM_API_URL` | No | BGSTM backend URL. Results reported if set; silently skipped if not (`tolerateOffline: true`). |
| `BGSTM_API_TOKEN` | No | Auth token for BGSTM API. |
| `BGSTM_PROJECT_ID` | No | BGSTM project ID to associate results with. |
| `ACCOUNTING_TENANT_ID` | No | Tenant ID used in `example.spec.ts` fixture composition demo. Defaults to `demo-tenant`. |

## Requirement annotations used

| Requirement ID | Description |
|---|---|
| `REQ-ACC-INVOICE-LIST` | Ledger page loads and displays the ledger list. |
| `REQ-ACC-JOURNAL-CREATE` | Journal page loads and displays the journal entry list. |
| `REQ-ACC-LEDGER-FILTER` | Ledger page is accessible within a tenant-scoped fixture context. |

## Tests

- **`tests/accounting.spec.ts`** — Core accounting page tests. Exercises `LedgerPage` and `JournalPage` navigation with BGSTM requirement annotations and `expect.soft` for non-blocking assertions.
- **`tests/example.spec.ts`** — Fixture composition demonstration. Shows how a consumer project extends the `base → accounting → consumer` fixture chain with their own `tenantId` fixture.

## License

Apache-2.0 — see [LICENSE](../../LICENSE).

Implemented in [#6](https://github.com/bg-playground/bgstm-playwright-frameworks/issues/6).
