import { test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe("test suit 1", () => {
  test.beforeEach(async ({ page }) => {
    await page.getByText("Forms").click();
  });
  test("navigate to Forms layouts", async ({ page }) => {
    await page.getByText("Form Layouts").click();
  });
  test("navigate to dartapicker", async({page}) => {
    await page.getByText("Datepicker").click();
  });
});

test.describe("test suit 2", () => {
  test.beforeEach(async ({ page }) => {
    await page.getByText("Modal & Overlays").click();
  });
  test("navigate to dialog", async ({ page }) => {
    await page.getByText("Dialog").click();
  });
  test("navigate to window", async({page}) => {
    await page.getByText("Window").click();
  });
});