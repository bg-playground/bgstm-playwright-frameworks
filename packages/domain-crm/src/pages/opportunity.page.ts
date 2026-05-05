import { BasePage } from '@bgstm/playwright-core';
import type { Page, Locator } from '@playwright/test';

export class OpportunityPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async navigate(): Promise<void> {
    await this.page.goto('/opportunities');
    await this.waitForLoad();
  }

  byLeadId(leadId: string): Locator {
    return this.page.locator(`[data-lead-id="${leadId}"]`);
  }
}
