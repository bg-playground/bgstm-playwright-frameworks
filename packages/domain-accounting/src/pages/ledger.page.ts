// Copyright 2024 bg-playground
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { BasePage } from '@bgstm/playwright-core';
import type { Page } from '@playwright/test';

export interface LedgerEntry {
  id: string;
  description: string;
  amount: number;
  currency?: string;
}

export class LedgerPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async navigate(): Promise<void> {
    await this.page.goto('/ledgers');
    await this.waitForLoad();
  }

  async filter(_criteria: Partial<LedgerEntry>): Promise<void> {
    throw new Error('Not yet implemented');
  }

  async openEntry(_id: string): Promise<void> {
    throw new Error('Not yet implemented');
  }

  async getEntryCount(): Promise<number> {
    throw new Error('Not yet implemented');
  }
}
