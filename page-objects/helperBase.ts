import { Page } from "@playwright/test";

export class Helper {
    readonly page: Page

    constructor(page: Page) {
        this.page = page
        
    }

    async waitForNumberOfSec(time: number){
        await this.page.waitForTimeout(time * 1000)
    }
}