import { expect, test } from "@playwright/test";
import { PageManager } from "../page-objects/pageManager";
import { DialogButton, DialogCloseBtn } from "../page-objects/dialogPage";
import { faker } from "@faker-js/faker";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("DialogWithComponent", async ({ page }) => {
  const pageManager = new PageManager(page);
  await pageManager.navigateTo().dialogPage();
  await pageManager.onDialogPage().openDialog(DialogButton.Component)
  await expect(pageManager.onDialogPage().dialogTitle).toHaveText(
    "This is a title passed to the dialog component"
  );
  await pageManager.onDialogPage().closeDialog(DialogCloseBtn.Dismiss)
  await expect(pageManager.onDialogPage().dialogTitle).not.toHaveText(
    "This is a title passed to the dialog component"
  );
});

test("DialogWithTemplate", async ({ page }) => {
  const pageManager = new PageManager(page);
  await pageManager.navigateTo().dialogPage();
  await pageManager.onDialogPage().openDialog(DialogButton.Template)
  await expect(pageManager.onDialogPage().dialogTitle).toHaveText(
    "Template Dialog"
  ); 
  await pageManager.onDialogPage().closeDialog(DialogCloseBtn.Close)
  await expect(pageManager.onDialogPage().dialogTitle).not.toHaveText(
    "Template Dialog"
  );
  
});

test("DialogWithBackdrop", async ({ page }) => {
  const pageManager = new PageManager(page);
  await pageManager.navigateTo().dialogPage();
  await pageManager.onDialogPage().openDialog(DialogButton.WithBackdrop)
  await expect(pageManager.onDialogPage().dialogTitle).toHaveText(
    "This is a title passed to the dialog component"
  ); 
  await pageManager.onDialogPage().closeDialog(DialogCloseBtn.Dismiss)
  await expect(pageManager.onDialogPage().dialogTitle).not.toHaveText(
    "This is a title passed to the dialog component"
  );
  
});

test("DialogWithoutBackdrop regular closer", async ({ page }) => {
  const pageManager = new PageManager(page);
  await pageManager.navigateTo().dialogPage();
  await pageManager.onDialogPage().openDialog(DialogButton.WithoutBackdrop)
  await expect(pageManager.onDialogPage().dialogTitle).toHaveText(
    "Template Dialog"
  ); 
  await pageManager.onDialogPage().closeDialog(DialogCloseBtn.Close)
  await expect(pageManager.onDialogPage().dialogTitle).not.toHaveText(
    "Template Dialog"
  );
  
});

test("DialogWithoutBackdrop background check", async ({ page }) => {
  const pageManager = new PageManager(page);
  await pageManager.navigateTo().dialogPage();
  await pageManager.onDialogPage().openDialog(DialogButton.WithoutBackdrop)
  await expect(pageManager.onDialogPage().dialogTitle).toHaveText(
    "Template Dialog"
  ); 
  await pageManager.onDialogPage().colorThemeBtn.click()
  await expect(pageManager.onDialogPage().dialogTitle).toHaveText(
    "Template Dialog"
  );
  
});

test("Dialog with esc btn enabled ", async ({ page }) => {
  const pageManager = new PageManager(page);
  await pageManager.navigateTo().dialogPage();
  await pageManager.onDialogPage().openDialog(DialogButton.WithEscClose);
  await expect(pageManager.onDialogPage().dialogTitle).toHaveText(
    "This is a title passed to the dialog component"
  );
  await pageManager.onDialogPage().dialogTitle.press("Escape");
  await expect(pageManager.onDialogPage().dialogTitle).not.toHaveText(
    "This is a title passed to the dialog component"
  );
});
test("Dialog with esc btn disabled ", async ({ page }) => {
  const pageManager = new PageManager(page);
  await pageManager.navigateTo().dialogPage();
  await pageManager.onDialogPage().openDialog(DialogButton.WithoutEscClose);
  await expect(pageManager.onDialogPage().dialogTitle).toHaveText(
    "Template Dialog"
  );
  await pageManager.onDialogPage().dialogTitle.press("Escape");
  await expect(pageManager.onDialogPage().dialogTitle).toHaveText(
    "Template Dialog"
  );
  await pageManager.onDialogPage().closeDialog(DialogCloseBtn.Close);
  await expect(pageManager.onDialogPage().dialogTitle).not.toHaveText(
    "Template Dialog"
  );
});
test("Dialog returns entered name", async ({ page }) => {
  const pageManager = new PageManager(page);
  await pageManager.navigateTo().dialogPage();

  const iterations = 4;
  const names: string[] = [];

  for (let i = 0; i<iterations; i++) {
    const fullName = faker.person.fullName();
    names.push(fullName)
    await pageManager
      .onDialogPage()
      .openDialog(DialogButton.WithEnterNameField);
    await expect(pageManager.onDialogPage().dialogTitle).toHaveText(
      "Enter your name"
    );
    await pageManager.onDialogPage().fillTheNameForm(fullName);
    await pageManager.onDialogPage().closeDialog(DialogCloseBtn.Submit)
  }

  const uiNames = (await page.locator('.form-input-card').getByRole('listitem').allTextContents())
  .map(name => name.trim())
  
  await expect(page.locator('.form-input-card').getByRole('listitem')).toHaveCount(iterations)
  expect(names).toEqual(uiNames)
});

test("Dialog does not add names when canceled", async ({ page }) => {
  const pageManager = new PageManager(page);
  await pageManager.navigateTo().dialogPage();

  const iterations = 4;

  for (let i = 0; i<iterations; i++) {
    const fullName = faker.person.fullName();
    await pageManager
      .onDialogPage()
      .openDialog(DialogButton.WithEnterNameField);
    await expect(pageManager.onDialogPage().dialogTitle).toHaveText(
      "Enter your name"
    );
    await pageManager.onDialogPage().fillTheNameForm(fullName);
    await pageManager.onDialogPage().closeDialog(DialogCloseBtn.Cancel)
  }
  
  await expect(page.locator('.form-input-card').getByRole('listitem')).toHaveCount(0)
});
