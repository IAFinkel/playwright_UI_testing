import { defineConfig, devices } from "@playwright/test";
import type { TestOptions } from "./test-options";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig<TestOptions>({
  // timeout: 10000,
  // globalTimeout: 60000,
  // expect: {
  //   timeout: 2000
  // },
  
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  reporter:  [
    // Use "dot" reporter on CI, "list" otherwise (Playwright default).
    process.env.CI ? ["dot"] : ["list"],
    // Add Argos reporter.
    [
      "@argos-ci/playwright/reporter",
      {
        // Upload to Argos on CI only.
        uploadToArgos: !!process.env.CI,
      },
    ],
  ],

  use: {
    //baseURL: "http://localhost:4200/",
    globalsQaURL: "https://www.globalsqa.com/demo-site/draganddrop/",
    baseURL: process.env.DEV === '1' ? 'http://localhost:4201/'
          : process.env.STAGING === '1' ? 'http://localhost:4202/'
          : 'http://localhost:4200/',

    trace: "on-first-retry",
    screenshot: "only-on-failure",
    actionTimeout: 20000,
    navigationTimeout: 25000
  },

  projects: [
    {
      name: "dev",
      use: { ...devices["Desktop Chrome"], baseURL: "http://localhost:4200/" },
    },
    {
      name: "chromium",
    },

    {
      name: "firefox",
      use: { browserName: "firefox" },
    },

    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "mobile",
      testMatch: 'testMobile.spec.ts',
      use: {
        ...devices['iPhone 15 Pro Max'],
      }

    }
  ],

  webServer:{
    command: 'npm run start',
    url: 'http://localhost:4200/',
    timeout: 120000,
    reuseExistingServer: !process.env.CI,
  }
});
