import { test } from "@playwright/test";
import { PageManager } from "../page-objects/pageManager";
import { faker } from "@faker-js/faker";
import { argosScreenshot } from "@argos-ci/playwright";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("Navigate to Forms Layout", async ({ page }) => {
  const pageManager = new PageManager(page);
  await pageManager.navigateTo().formLayoutPage();
  await argosScreenshot(page, "forms layout page");
  await pageManager.navigateTo().datePickerPage();
  await argosScreenshot(page, "datapicker page");
});

test("parametrized method", async ({ page }) => {
  const pageManager = new PageManager(page);
  const randomFullName = faker.person.fullName();
  const randomEmail = faker.internet.email();
  const randomEmailBasedOnName = `${randomFullName.replace(
    " ",
    ""
  )}${faker.number.int(1000)}@test.com`;

  await pageManager.navigateTo().formLayoutPage();
  await pageManager
    .onFormLayoutPage()
    .submitUsingTheGridForm(
      process.env.USERNAME,
      process.env.PASSWORD,
      "Option 1"
    );
  await argosScreenshot(page, "submit using the grid form");

  await pageManager
    .onFormLayoutPage()
    .submitInlineForm(randomFullName, randomEmailBasedOnName, false);
});

test("data picker", async ({ page }) => {
  const pageManager = new PageManager(page);
  await pageManager.navigateTo().datePickerPage();
  await pageManager.onDataPickerPage().selectComonDatePicker(60);
  await argosScreenshot(page, 'select common calendar')
  await pageManager.onDataPickerPage().selectDatePickerWithRange(1, 60);
  await argosScreenshot(page, 'select date picker range')
});
