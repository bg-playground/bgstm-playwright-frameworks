import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['@bgstm/playwright-core/reporter', {
      apiUrl: process.env.BGSTM_API_URL,
      apiToken: process.env.BGSTM_API_TOKEN,
      projectId: process.env.BGSTM_PROJECT_ID,
      tolerateOffline: true,
    }],
  ],
  use: {
    baseURL: process.env.CRM_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
