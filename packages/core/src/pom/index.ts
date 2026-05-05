import type { Page } from '@playwright/test';

/**
 * Base class for all page objects in BGSTM domain packs.
 */
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  /** Navigate to the page's base URL path */
  abstract navigate(): Promise<void>;

  /** Wait for the page to be fully loaded */
  async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }
}
