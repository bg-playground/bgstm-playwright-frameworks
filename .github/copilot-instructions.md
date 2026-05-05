# Copilot Instructions for bgstm-playwright-frameworks

## Project overview
This is a pnpm monorepo of domain-specific Playwright automation frameworks with native BGSTM traceability.

## Monorepo structure
- `packages/core` — @bgstm/playwright-core: base fixtures, POM utilities, BGSTM reporter
- `packages/domain-crm` — @bgstm/domain-crm: CRM page objects, factories, flows
- `packages/domain-accounting` — @bgstm/domain-accounting: Accounting page objects, factories, flows
- `examples/` — standalone runnable Playwright projects
- `scripts/create-bgstm-playwright/` — CLI scaffolder

## Key conventions
- TypeScript strict mode everywhere
- All packages export from `src/index.ts`
- Use `@playwright/test` fixtures pattern for page objects
- BGSTM reporter wires into the Reporter API contract from BGSTM issue #291
- Changesets for versioning: run `pnpm changeset` before merging feature PRs
- Prettier + ESLint for formatting and linting

## Commands
- `pnpm install` — install all dependencies
- `pnpm build` — build all packages
- `pnpm test` — run all tests
- `pnpm lint` — lint all packages
- `pnpm typecheck` — type-check all packages
- `pnpm changeset` — create a changeset for your changes
