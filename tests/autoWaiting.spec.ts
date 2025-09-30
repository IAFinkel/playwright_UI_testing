import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }, testInfo) => {
  await page.goto(process.env.URL);
  //await page.goto("http://uitestingplayground.com/ajax")
  await page.getByText("Button Triggering AJAX Request").click();
  testInfo.setTimeout(testInfo.timeout + 2000)
});

test('auto wait', async({page})=>{
     const successBtn = page.locator('.bg-success')

    // await successBtn.click()

    // const text = await successBtn.textContent()
    // expect(text).toEqual('Data loaded with AJAX get request.')

    //1. Custom wait method
    // await successBtn.waitFor({state:'attached'})
    // const text1 = await successBtn.allTextContents()
    // expect(text1).toContain('Data loaded with AJAX get request.')
    
    //2. Timeout on the locator assertions
    //await expect(successBtn).toHaveText('Data loaded with AJAX get request.', {timeout: 20000})

    //3. Alternative wait methods

    //3.1 wait for element:
    //await page.waitForSelector('.bg-success')
    
    //3.2 wait for the responce
    await page.waitForResponse('http://uitestingplayground.com/ajaxdata')

    //3.3 wait for network call to be completed (Not recomended)
    await page.waitForLoadState('networkidle')

    const text1 = await successBtn.allTextContents()
    expect(text1).toContain('Data loaded with AJAX get request.')

})

test('timeouts', async({page})=>{
    //test.setTimeout(10000)
    test.slow()
     const successBtn = page.locator('.bg-success')
     await successBtn.click({timeout: 20000})

})