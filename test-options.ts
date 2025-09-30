import { test as base } from "@playwright/test";
import { PageManager } from "../pw-practice-app/page-objects/pageManager";

export type TestOptions = {
  globalsQaURL: string;
  formsLayoutPage: string;
  pagemanager: PageManager;
};

export const test = base.extend<TestOptions>({
  globalsQaURL: ["", { option: true }],

  formsLayoutPage: async ({ page }, use) => {
    await page.goto("/");
    await page.getByText("Forms").click();
    await page.getByText("Form Layouts").click();
    await use("");
  },

  pagemanager: async ({ page, formsLayoutPage }, use) => {
    const pageManager = new PageManager(page);
    await use(pageManager);
  },
});
