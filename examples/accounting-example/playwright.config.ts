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
//
// Invoked via 'pnpm smoke' (not 'pnpm test') — see package.json.

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
    baseURL: process.env.ACCOUNTING_BASE_URL || 'http://localhost:3000', // ACCOUNTING_BASE_URL env var or default
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
