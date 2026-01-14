import { Locator, Page } from "@playwright/test";

export class NavigationPage {
  readonly page: Page;
  readonly formsLayots: Locator;
  readonly toaster: Locator;
  readonly smartTable: Locator;
  readonly dataPicker: Locator;
  readonly dialog: Locator;

  constructor(page: Page) {
    this.page = page;
    this.formsLayots = page.getByText("Form Layouts");
    this.toaster = page.getByText("Toastr");
    this.dataPicker = page.getByText("Datepicker");
    this.smartTable = page.getByText("Smart Table");
    this.dialog = page.getByText("Dialog");
  }

  async formLayoutPage() {
    this.selectGroupMenuItem("Forms");
    await this.formsLayots.click();
  }

  async toasterPage() {
    this.selectGroupMenuItem("Modal & Overlays");
    await this.toaster.click();
  }

  async dialogPage() {
    this.selectGroupMenuItem("Modal & Overlays");
    await this.dialog.click();
  }

  async smartTablePage() {
    this.selectGroupMenuItem("Tables & Data");
    await this.smartTable.click();
  }

  async datePickerPage() {
    this.selectGroupMenuItem("Forms");
    await this.dataPicker.click();
  }

  private async selectGroupMenuItem(groupMenuItem: string) {
    const element = this.page.locator(`[title="${groupMenuItem}"]`);
    const elementState = await element.getAttribute("aria-expanded");
    if (elementState === "false") {
      await element.click();
    }
  }
}
