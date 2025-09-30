import { expect } from "@playwright/test";
import {test} from '../test-options'
test ('iframe + drag and drop', async({page, globalsQaURL})=>{
    page.on("pageerror", (err) => {
    console.log("Ignoring page error:", err.message);
  });
    await page.goto(globalsQaURL);

    //find the locator for the iframe element
    const iframe = page.frameLocator('[rel-title="Photo Manager"] iframe') 
    //find the locator for the drop area and drag to it
    await iframe.locator('li').locator('[alt="The peaks of High Tatras"]')
    .dragTo(iframe.locator('#trash'))

    //drag and drop using mouse

    const elementToDrag = iframe.locator('li').locator('[alt="The chalet at the Green mountain lake"]')
    await elementToDrag.hover()
    await page.mouse.down()
    await iframe.locator('#trash').hover()
    await page.mouse.up()

    await expect(iframe.locator('#trash li h5')).toHaveText(['High Tatras', 'High Tatras 2'])

})