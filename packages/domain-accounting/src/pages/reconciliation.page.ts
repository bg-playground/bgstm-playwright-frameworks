import { BasePage } from '@bgstm/playwright-core';
import type { Page } from '@playwright/test';

export class ReconciliationPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async navigate(): Promise<void> {
    await this.page.goto('/reconciliations');
    await this.waitForLoad();
  }
}
