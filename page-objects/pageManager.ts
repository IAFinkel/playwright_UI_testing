import { Page } from "@playwright/test";
import { NavigationPage } from "../page-objects/navigationPage"
import { FormsLayotPage } from "../page-objects/formLayotPage"
import { DatePickerPage } from "../page-objects/datePickerPage"
import { DialogPage } from "../page-objects/dialogPage"


export class PageManager {
    
    private readonly page: Page
    private readonly datapickerPage: DatePickerPage
    private readonly formLayoutPage: FormsLayotPage
    private readonly navigationPage: NavigationPage
    private readonly dialogPage: DialogPage


    constructor(page: Page) {
        this.page = page
        this.datapickerPage = new DatePickerPage(this.page)
        this.formLayoutPage = new FormsLayotPage(this.page)
        this.navigationPage = new NavigationPage(this.page)
        this.dialogPage = new DialogPage(this.page)

    }

    navigateTo(){
        return this.navigationPage
    }

    onDataPickerPage(){
        return this.datapickerPage
    }

    onFormLayoutPage(){
        return this.formLayoutPage
    }
    onDialogPage(){
        return this.dialogPage
    }
}