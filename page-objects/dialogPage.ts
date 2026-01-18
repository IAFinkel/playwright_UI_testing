import { Page } from "@playwright/test";
import { Helper } from "./helperBase";

export enum DialogButton {
    Component = "Open Dialog with component",
    Template = "Open Dialog with template",
    WithBackdrop = "Open Dialog with backdrop",
    WithoutBackdrop = "Open Dialog without backdrop",
    WithEscClose = "Open Dialog with esc close",
    WithoutEscClose = "Open Dialog without esc close",
    WithEnterNameField = "Enter Name"
}

export enum DialogCloseBtn {
    Dismiss = "Dismiss Dialog",
    Close = "Close Dialog",
    Cancel = "Cancel",
    Submit = "Submit"
}

export class DialogPage extends Helper{
     constructor(page: Page) {
        super(page)
    }

    dialogTitle = this.page.locator("nb-card-header").last();
    colorThemeBtn = this.page.getByText("Light");


    async openDialog(dialogType: DialogButton) {
    await this.page.getByRole('button', {name: dialogType, exact: true}).click()
  }

    async closeDialog(dialogType: DialogCloseBtn){
       await this.page.getByRole('button', {name: dialogType, exact: true}).click()
    }

    async fillTheNameForm(fullName: string){
        await this.page.getByPlaceholder("Name").fill(fullName)
    }

    get DialogTitle(){
        return this.dialogTitle
    }
}