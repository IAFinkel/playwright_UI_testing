import test, { expect } from "@playwright/test";

test("Input fields", async ({ page }, testInfo) => {
  await page.goto("/");
  if (testInfo.project.name == "mobile") {
    await page.locator(".sidebar-toggle").click();
  }

  await page.getByText("Forms").click();
  await page.getByText("Form Layouts").click();
  if (testInfo.project.name == "mobile") {
    await page.locator(".sidebar-toggle").click();
  }
  const emailField = page.locator("#inputEmail1");
  await emailField.fill("test@test.com");
  const passwordField = page.locator("#inputPassword2");
  await passwordField.fill("password");
  await page.getByRole("radio", { name: "Option 1" }).check({ force: true });
  //page.getByRole("button", { name: "Sign in" });
});
