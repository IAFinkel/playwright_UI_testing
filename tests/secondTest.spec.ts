import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.getByText("Forms").click();
  await page.getByText("Form Layouts").click();
});

test.describe("DOM", () => {
  test("locator syntax rules", async ({ page }) => {
    //by Tag name
    await page.locator("input").first().click();

    //by Id
    page.locator("#inputEmail1");

    //by class
    page.locator(".shape-rectangle");

    //by attribute
    page.locator('[placeholder="Email"]');

    //by full class value
    page.locator(
      '[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]'
    );

    //combinations
    page.locator('input[placeholder="Email"].shape-rectangle');

    //by Xpath (NOT RECOMENDED TO USE)
    page.locator('//*[@id="inputEmail1"]');

    //by partial text match
    page.locator(':text("Using")');

    //by exact text match
    page.locator(':text-is("Using the Grid")');
  });

  test("user facing locators", async ({ page }) => {
    await page.getByRole("textbox", { name: "Email" }).first().click();
    await page.getByRole("button", { name: "Sign in" }).first().click();

    await page.getByLabel("Email").first().click();

    await page.getByPlaceholder("Jane Doe").click();

    await page.getByText("Using the Grid").click();

   // await page.getByTitle("IoT Dashboard").click();

    //By test id:
    //go to the source code and find were the element is located (.html file)
    //element before the change:
    // <button type="submit" nbButton status="primary">Sign in</button>
    //element after the change:
    // <button data-testid="SignIn" type="submit" nbButton status="primary">Sign in</button>

    await page.getByTestId("SignIn").click();
  });

  test("child elements", async ({ page }) => {
    await page.locator('nb-radio-group nb-radio :text("Option 2")').click();
    await page
      .locator("nb-radio-group")
      .locator("nb-radio")
      .locator(':text("Option 2")')
      .click();
    await page
      .locator("nb-card")
      .getByRole("button", { name: "Sign in" })
      .first()
      .click();
    await page.locator("nb-card").nth(3).click();
  });

  test("parent elements", async ({ page }) => {
    await page.locator("nb-card", { hasText: "Using the Grid" }).getByRole("textbox", { name: "Email" }).click();
    await page.locator("nb-card", { has: page.locator("#inputEmail1") }).getByRole("textbox", { name: "Email" }).click();

    await page.locator("nb-card").filter({ hasText: "Basic form" }).getByRole("textbox", { name: "Email" }).click();
    await page.locator("nb-card").filter({ has: page.locator("#exampleInputEmail1") }).getByRole("textbox", { name: "Email" }).click();

    await page.locator("nb-card").filter({ has: page.locator("nb-checkbox") }).filter({ hasText: "Sign in" }).getByRole("textbox", { name: "Email" }).click();

    await page.locator(':text-is("Using the Grid")').locator("..").getByRole("textbox", { name: "Email" }).click();
  });

   test("reusing the elements", async ({ page }) => {
    const basicForm = page.locator("nb-card").filter({ hasText: "Basic form" })

    await basicForm.getByRole("textbox", { name: "Email" }).fill('email@test.com')
    await basicForm.getByRole("textbox", { name: "Password" }).fill('testpassword')
    await basicForm.locator('nb-checkbox').click()
    await basicForm.getByText('Submit').click()

    await expect(basicForm.getByRole("textbox", { name: "Email" })).toHaveValue('email@test.com')

  });

  test("extracting values", async ({ page }) => {
    //single text value
    
    const basicForm = page.locator("nb-card").filter({ hasText: "Basic form" })
    const buttonText = await basicForm.locator('button').textContent()

    expect(buttonText).toEqual('Submit')

    //all values
    const allRadioBtns = await page.locator('nb-radio').allTextContents()
    expect (allRadioBtns).toContain('Option 1')

    //input field value
     const emailField = basicForm.getByRole("textbox", { name: "Email" })
     await emailField.fill('email@test.com')
     const emailValue = await emailField.inputValue()
     expect (emailValue).toEqual('email@test.com')

     //attribute value
     const attributeValue = await emailField.getAttribute('placeholder')
     expect(attributeValue).toEqual('Email')

  });

  test("Assertions", async ({ page }) => {

    //1. General assertions - to compare left and right part of the assertions

    const value = 5
    expect(value).toEqual(5)

    const basicForm = page.locator("nb-card").filter({ hasText: "Basic form" })
    const buttonText = await basicForm.locator('button').textContent()
    expect(buttonText).toEqual('Submit')

    //2. Locator assertions - become available if we take not a varible, but an element
    //different from general assertion, locator ass will wait 5 sec until the element is available

    await expect(basicForm.locator('button')).toHaveText('Submit')

    //3. Soft assertion - the test will be continued even if assertion failed

    await expect.soft(basicForm.locator('button')).toHaveText('Submit')
    await basicForm.locator('button').click()

  })


});