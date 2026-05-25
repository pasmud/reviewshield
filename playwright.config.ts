import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  retries: 0,
  use: {
    baseURL: 'http://localhost:42000',
    headless: true,
  },
  webServer: {
    command: 'npm run dev --prefix server',
    port: 42000,
    timeout: 15000,
    reuseExistingServer: true,
  },
});
