import { BasePage } from '@bgstm/playwright-core';
import type { Page } from '@playwright/test';

export interface Lead {
  id: string;
  name: string;
  value?: number;
}

export class LeadPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async navigate(): Promise<void> {
    await this.page.goto('/leads');
    await this.waitForLoad();
  }

  async create(_data: Omit<Lead, 'id'>): Promise<Lead> {
    // TODO: implement lead creation flow
    throw new Error('Not yet implemented');
  }

  async convert(_leadId: string): Promise<void> {
    // TODO: implement lead conversion flow
    throw new Error('Not yet implemented');
  }
}
