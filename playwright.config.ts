import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests-e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    headless: true,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'dev-chromium',
      use: { ...devices['Desktop Chrome'], baseURL: 'http://localhost:3000' },
      webServer: process.env.E2E_NO_SERVER ? undefined : {
        command: 'pnpm dev',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
      },
    },
    {
      name: 'preview-chromium',
      use: { ...devices['Desktop Chrome'], baseURL: 'http://localhost:4173' },
      webServer: process.env.E2E_NO_SERVER ? undefined : {
        command: 'pnpm preview',
        url: 'http://localhost:4173',
        reuseExistingServer: !process.env.CI,
      },
    },
  ],
});


