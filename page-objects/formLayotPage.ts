import { Page } from "@playwright/test";

export class FormsLayotPage {
    private readonly page: Page

    constructor(page: Page) {
        this.page=page
    }

    async submitUsingTheGridForm(email: string, password: string, option: string){
        const usingTheGrid = this.page.locator("nb-card", { hasText: "Using the Grid" })
         await usingTheGrid.getByRole("textbox", { name: "Email" }).fill(email)
         await usingTheGrid.getByRole("textbox", { name: "Password" }).fill(password)
         await usingTheGrid.getByRole('radio', {name: option}).check({force:true})
         await usingTheGrid.getByRole('button').click()

    }

    async submitInlineForm(fullName: string, email: string, rememberMeOption: boolean){
        const inlineForm = this.page.locator("nb-card.inline-form-card")
         await inlineForm.getByPlaceholder("Jane Doe").fill(fullName)
         await inlineForm.getByPlaceholder("Email").fill(email)
         if(rememberMeOption){
            await inlineForm.getByRole('checkbox').check({force:true})
         }
         
         await inlineForm.getByRole('button').click()

    }
    
}