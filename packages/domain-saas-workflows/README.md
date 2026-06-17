# @bgstm/domain-saas-workflows

> 🚧 **Stub** package for Playwright automation of AI workforce and multi-channel SaaS workflow platforms.

[![Status: Stub](https://img.shields.io/badge/status-stub-orange.svg)](#)

`@bgstm/domain-saas-workflows` provides starter page objects and factories for three common cross-product workflow areas: AI receptionist call handling, scheduling orchestration, and CRM-from-call lifecycle updates.

## Installation

```bash
npm i -D @bgstm/domain-saas-workflows @playwright/test
```

## Why this pack

Unlike `@bgstm/domain-crm`, this package focuses on **cross-channel, multi-actor flows** where work moves across systems (voice ↔ calendar ↔ CRM ↔ SMS/email) instead of single-entity CRUD actions.

## Flows in this stub

| Flow area | Page object | Status |
| --- | --- | --- |
| AI Receptionist | `ReceptionistPage` | 🚧 Stub |
| Scheduling | `SchedulingPage` | 🚧 Stub |
| CRM-from-Call | `CrmFromCallPage` | 🚧 Stub |

## BGSTM annotation example

```ts
// @ts-nocheck
import { test, expect } from '@playwright/test';
import { ReceptionistPage, SchedulingPage, makeInboundCall } from '@bgstm/domain-saas-workflows';

test(
  'books an appointment from an inbound AI receptionist call',
  { annotation: { type: 'bgstm:requirement', description: 'REQ-SAAS-WF-001' } },
  async ({ page }) => {
    const receptionist = new ReceptionistPage(page);
    const scheduling = new SchedulingPage(page);

    await receptionist.simulateInboundCall(makeInboundCall());
    await receptionist.assertIntentCaptured({ name: 'book_appointment' });
    await scheduling.openAvailability('2026-01-01');
    await scheduling.assertConfirmationSent('sms');

    await expect(page).toBeDefined();
  },
);
```

See the same snippet in [`examples/ai-receptionist.spec.example.ts`](./examples/ai-receptionist.spec.example.ts).

## Status & roadmap

### Stubbed in v0.0.1

- Package skeleton with TypeScript exports
- Stub page objects for AI receptionist, scheduling, and CRM-from-call
- Typed data factories for calls, appointments, and contacts/leads
- BGSTM annotation usage example

### Planned next

- Playwright fixtures for page object composition
- Runnable example project with mock SaaS workflow backend
- Production-ready flow implementations for real UI targets

> 💼 **Looking for regulated-industry packs** (Healthcare/HIPAA, Financial/SOX, GxP)? Those are available as part of [NAT](https://nat-testing.io) — the managed test execution platform built around BGSTM.

## License

Apache-2.0
