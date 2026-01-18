import { expect, test } from "@playwright/test";
import { PageManager } from "../page-objects/pageManager";
import { DialogButton, DialogCloseBtn } from "../page-objects/dialogPage";

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
  let i = 0;
  while (i < 4) {
    i++
    await pageManager
      .onDialogPage()
      .openDialog(DialogButton.WithEnterNameField);
    await expect(pageManager.onDialogPage().dialogTitle).toHaveText(
      "Enter your name"
    );
    await pageManager.onDialogPage().fillTheNameForm("Ilia");
    await pageManager.onDialogPage().closeDialog(DialogCloseBtn.Submit)
  }

  const namesLocator = page.locator('.form-input-card').getByRole('listitem')
  const names: string[] = await namesLocator.allTextContents();
  expect(names).toEqual(["Ilia", "Ilia", "Ilia", "Ilia"])
});
