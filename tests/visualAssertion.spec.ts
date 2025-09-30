import { test, expect } from "@playwright/test";

test("Visual test - radio btn", async ({ page }) => {
  await page.goto("/");
  await page.getByText("Forms").click();
  await page.getByText("Form Layouts").click();

  const radioBtn = page.getByRole("radio", { name: "Option 1" });
  const radioBtn2 = page.getByRole("radio", { name: "Option 2" });
  await radioBtn.check({ force: true });

  const status = await radioBtn.isChecked();
  //1. create a locator of the screen zone that you want to compare:

  const usingTheGridForm = page.locator("nb-card", {
    hasText: "Using the Grid",
  });

  //2. create the original (base) snapshot:
  await expect(usingTheGridForm).toHaveScreenshot({ maxDiffPixels: 150 });
});
