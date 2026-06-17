# @bgstm/domain-saas-workflows

> AI workforce and multi-channel SaaS workflow pack for Playwright covering AI receptionist, scheduling, and CRM-from-call automation flows.

[![Status: Stub](https://img.shields.io/badge/status-stub-orange.svg)](#)

## What's in the box

`@bgstm/domain-saas-workflows` is a stub domain pack for platforms that blend an AI receptionist, shared scheduling, and CRM updates into one operational surface. It provides starter page objects and typed factories for the three highest-overlap workflow areas: AI Receptionist, Scheduling, and CRM-from-Call.

## Installation

```bash
npm i -D @bgstm/domain-saas-workflows @playwright/test
```

## Why this pack

`@bgstm/domain-crm` is centered on entity-focused CRM actions. This pack targets the cross-channel, multi-actor workflows that CRM packs usually miss: voice ↔ calendar ↔ CRM ↔ SMS/email handoffs where a receptionist flow, a scheduler, and a human operator all touch the same journey.

## Flows

| Flow | Page Object |
| --- | --- |
| AI Receptionist | `ReceptionistPage` |
| Scheduling | `SchedulingPage` |
| CRM-from-Call | `CrmFromCallPage` |

## BGSTM annotation example

```ts
// @ts-nocheck
import { test } from '@playwright/test';

import { ReceptionistPage, makeInboundCall } from '../src/index.js';

test(
  'captures a booking intent from an inbound call',
  { annotation: { type: 'bgstm:requirement', description: 'REQ-AI-RECEPTIONIST-001' } },
  async ({ page }) => {
    const receptionistPage = new ReceptionistPage(page);
    const inboundCall = makeInboundCall({ requestedService: 'Initial consultation' });

    await receptionistPage.simulateInboundCall(inboundCall);
    await receptionistPage.assertIntentCaptured({ name: 'book_appointment', channel: 'voice' });
    await receptionistPage.assertCallRoutedToQueue('appointments');
  },
);
```

See [`examples/ai-receptionist.spec.example.ts`](./examples/ai-receptionist.spec.example.ts) for the same runnable-looking documentation example.

## Status & roadmap

- **Stubbed in v0.0.1**
  - Typed models for calls, transcripts, scheduling slots, appointments, contacts, and leads
  - Stub page objects for AI receptionist, scheduling, and CRM-from-call workflows
  - Factory helpers for building representative test data quickly
- **Planned next**
  - Real selectors and navigation helpers
  - End-to-end workflow fixtures for multi-actor SaaS flows
  - Deeper notification and orchestration coverage across voice, calendar, CRM, and outbound messaging

## License

Apache-2.0

> 💼 **Looking for regulated industries?** Healthcare/HIPAA, Financial/SOX, and GxP packs are available as part of [NAT](https://nat-testing.io) — the managed test execution platform built around BGSTM.
