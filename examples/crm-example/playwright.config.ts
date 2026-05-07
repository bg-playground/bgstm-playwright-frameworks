// Apache-2.0

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  retries: 0,
  reporter: process.env.BGSTM_API_URL
    ? [
        ['list'],
        [
          '@bgstm/playwright-core/reporter',
          {
            tolerateOffline: false,
          },
        ],
      ]
    : [['list']],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
