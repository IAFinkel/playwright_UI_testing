import { test, expect } from "@playwright/test";

//retry config
test.describe.configure({retries: 0})

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.getByText("Forms").click();
  await page.getByText("Form Layouts").click();
});

test("Input fields", async ({ page }, testInfo) => {
  
  if(testInfo.retry){
    //add some code that need to be executed before the next retrie
  }
  
  const emailField = page.locator("#inputEmail1");

  await emailField.fill("test@test.com");
  await emailField.clear();
  await emailField.pressSequentially("test2@test.com", { delay: 500 });

  //global assertion
  const emailValue = await emailField.inputValue();
  expect(emailValue).toEqual("test2@test.com");

  //locator assertion
  await expect(emailField).toHaveValue("test2@test.com");
});

test("Radio btn", async ({ page }) => {
  const radioBtn = page.getByRole("radio", { name: "Option 1" });
  const radioBtn2 = page.getByRole("radio", { name: "Option 2" });
  await radioBtn.check({ force: true });

  const status = await radioBtn.isChecked();
  expect(status).toBeTruthy();
  expect(radioBtn).toBeChecked();

  await radioBtn2.check({ force: true });
  expect(await radioBtn.isChecked()).toBeFalsy();
  expect(await radioBtn2.isChecked()).toBeTruthy();
});

test("checkboxes", async ({ page }) => {
  await page.getByText("Modal & Overlays").click();
  await page.getByText("Toastr").click();

  const allCheckboxes = await page.getByRole("checkbox").all();
  for (const element of allCheckboxes) {
    await element.check({ force: true });
    expect(await element.isChecked()).toBeTruthy();
  }

  for (const element of allCheckboxes) {
    await element.uncheck({ force: true });
    expect(await element.isChecked()).toBeFalsy();
  }
});

test("drop-down list", async ({ page }) => {
  page.getByRole("list"); //when the list element has a UL tag
  page.getByRole("listitem"); //when the list element has a LI tag

  const lightBtn = page.getByRole("button").first();
  await lightBtn.click();
  const alloptions = page.locator("nb-option-list nb-option");
  await expect(alloptions).toHaveText(["Light", "Dark", "Cosmic", "Corporate"]);

  await alloptions.nth(2).click();

  const header = page.locator("nb-layout-header");
  await expect(header).toHaveCSS("background-color", "rgb(50, 50, 89)");

  //check all options

  const expectedColors = {
    Light: "rgb(255, 255, 255)",
    Dark: "rgb(34, 43, 69)",
    Cosmic: "rgb(50, 50, 89)",
    Corporate: "rgb(255, 255, 255)",
  };

  await lightBtn.click();
  for (const color in expectedColors) {
    await alloptions.filter({ hasText: color }).click();
    await expect(header).toHaveCSS("background-color", expectedColors[color]);
    if (color !== "Corporate") {
      await lightBtn.click();
    }
  }
});

test("tooltips", async ({ page }) => {
  await page.getByText("Modal & Overlays").click();
  await page.getByText("Tooltip").click();

  const btn = page.locator("nb-card-body").getByRole("button", { name: "Top" });
  await btn.hover();

  //if the element have a role tooltip created
  page.getByRole("tooltip");

  //if no role, search using the regular locators
  const tooltip = page.locator("nb-tooltip");

  await expect(tooltip).toHaveText("This is a tooltip");
});

test("browser dialog boxes", async ({ page }) => {
  await page.getByText("Tables & Data").click();
  await page.getByText("Smart Table").click();

  //create a listener to lisen for the dialog event

  page.on("dialog", (dialog) => {
    //validate the dialog
    expect(dialog.message()).toContain("Are you sure");
    //Accept
    dialog.accept();
  });

  const tableRow = page
    .locator("table")
    .locator("tbody")
    .locator("tr", { hasText: "mdo@gmail.com" });
  await tableRow.locator(".nb-trash").click();
  //assertion option 1
  await expect(tableRow).toHaveCount(0);
  //option 2
  await expect(tableRow).not.toBeVisible();
});

test("web tables", async ({ page }) => {
  await page.getByText("Tables & Data").click();
  await page.getByText("Smart Table").click();

  //1. locate the table row by any text in this row:

  const tableRow = page.getByRole("row", { name: "twitter@outlook.com" });
  await tableRow.locator(".nb-edit").click();
  await tableRow.locator('[placeholder="Age"]').clear();
  await tableRow.locator('[placeholder="Age"]').fill("100");
  await tableRow.locator(".nb-checkmark").click();

  //Often the value inside the input field is not a html text, but a attribute property.
  //In this case you can not locate element with page.getByRole("row", { name: "twitter@outlook.com" })

  //2. get the row by the value in the specific column

  await page.locator(".ng2-smart-pagination").getByText("2").click();
  const tableRow3 = page.getByRole("row", { name: "11" });
  const targetRow = tableRow3.filter({
    has: page.locator("td").nth(1).getByText("11"),
  });
  await targetRow.locator(".nb-edit").click();
  await page.locator("input-editor").locator('[placeholder="Age"]').clear();
  await page.locator("input-editor").locator('[placeholder="Age"]').fill("100");

  await page.locator(".nb-checkmark").click();
  await expect(targetRow.locator("td").nth(6)).toHaveText("100");

  //3. filter the values on the table

  const age = ["20", "30", "40", "200"];

  for (const value of age) {
    const filter = page.locator("thead").getByPlaceholder("Age");
    await filter.clear();
    await filter.fill(value);
    await page.waitForTimeout(500);

    const filteredtable = await page.locator("tbody tr").all();

    for (const row of filteredtable) {
      const cellValue = await row.locator("td").last().textContent();
      if (value === "200") {
        await expect(page.locator("tr td")).toHaveText("No data found");
        expect(await page.getByRole("table").textContent()).toContain(
          "No data found"
        );
      } else {
        expect(cellValue).toEqual(value);
      }
    }
  }
});

test("data picker", async ({ page }) => {
  //1. simple: by class name and hardcoded value
  await page.getByText("Datepicker").click();
  await page.getByPlaceholder("Form Picker").click();
  await page
    .locator('[class="day-cell ng-star-inserted"]')
    .getByText("23", { exact: true })
    .click();
  await expect(page.getByPlaceholder("Form Picker")).toHaveValue(
    "Sep 23, 2025"
  );

  //2. using the Data object

  let date = new Date();
  date.setDate(date.getDate() + 200);

  //a desired date converted to string
  const expectedDate = date.getDate().toString();
  //a month value in a short version
  const expectedMonth = date.toLocaleString("En-US", { month: "short" });
  //a month with a long version
  const expectedMonthLong = date.toLocaleString("En-US", { month: "long" });
  //a full year value
  const expectedYear = date.getFullYear();

  const dateToAssert = `${expectedMonth} ${expectedDate}, ${expectedYear}`;
  const desiredMonthAndYear = ` ${expectedMonthLong} ${expectedYear} `;

  await page.getByPlaceholder("Form Picker").click();
  let currentMonthAndYear = await page
    .locator("nb-calendar")
    .getByRole("button")
    .first()
    .textContent();

  while (currentMonthAndYear !== desiredMonthAndYear) {
    await page
      .locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click();
    currentMonthAndYear = await page.locator("nb-calendar").getByRole("button").first().textContent();
  }

  await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, {exact: true}).click();
  await expect(page.getByPlaceholder("Form Picker")).toHaveValue(dateToAssert);
});

test("sliders", async ({ page }) => {

    //Option 1 - update the HTML attribute
      await page.getByText("IoT Dashboard").click();
      const slider = page.locator('nb-tab[tabtitle="Temperature"] ngx-temperature-dragger circle')
      //evaluation of the JS expression
      slider.evaluate(element =>{
        element.setAttribute('cx', '232')
        element.setAttribute('cy', '232')
      })
      //triger action on the element to apply the updated coordinates
      await slider.click()


      //Option 2 - move mouse according to the coordinates

      const tempBox = page.locator('nb-tab[tabtitle="Temperature"] ngx-temperature-dragger')
      //put the element into the view arria
      await tempBox.scrollIntoViewIfNeeded()
      //create the element with x and y coordinates
      const box = await tempBox.boundingBox()
      //to define a starting point at the centre of the box
      const x = box.x + box.width/2
      const y = box.y + box.height/2

      //moving mouse to the starting point
      await page.mouse.move(x,y)
      //click left mouse btn 
      await page.mouse.down()
      //move to the wright
       await page.mouse.move(x +100,y)
       //move down
       await page.mouse.move(x +100,y +100)
       //release the mouse btn
       await page.mouse.up()

       await expect(tempBox).toContainText('30')



})