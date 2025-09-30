import { expect, Page } from "@playwright/test";
import { Helper } from "./helperBase";

export class DatePickerPage extends Helper{

     constructor(page: Page) {
        super(page)
    }

    async selectComonDatePicker(numberOfDaysFromToday: number){

        const calendarInputField = this.page.getByPlaceholder("Form Picker")
        await this.waitForNumberOfSec(5)
        await calendarInputField.click();
        const dateToAssert = await this.selectDateInCalendar(numberOfDaysFromToday)
        await expect(calendarInputField).toHaveValue(dateToAssert);
    }

    async selectDatePickerWithRange(numberOfDaysFromTodayStart: number, numberOfDaysFromTodayFinish: number){

        const calendarInputField = this.page.getByPlaceholder("Range Picker")
        await calendarInputField.click();
        const dateToAssertStart = await this.selectDateInCalendar(numberOfDaysFromTodayStart)
        const dateToAssertFinish = await this.selectDateInCalendar(numberOfDaysFromTodayFinish)
        await expect(calendarInputField).toHaveValue(`${dateToAssertStart} - ${dateToAssertFinish}`);
    }

    private async selectDateInCalendar(numberOfDaysFromToday: number){
        let date = new Date();
        date.setDate(date.getDate() + numberOfDaysFromToday);
        
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
        
          let currentMonthAndYear = await this.page
            .locator("nb-calendar-view-mode")
            .textContent();
        
          while (currentMonthAndYear !== desiredMonthAndYear) {
            await this.page
              .locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click();
            currentMonthAndYear = await this.page.locator("nb-calendar-view-mode").textContent();
          }
        
          const dayCell = this.page.locator('[class="day-cell ng-star-inserted"]')
          const rangeCell = this.page.locator('[class="range-cell day-cell ng-star-inserted"]')
          if(await dayCell.first().isVisible()){
            await dayCell.getByText(expectedDate, {exact: true}).click();
          }else{
            await rangeCell.getByText(expectedDate, {exact: true}).click();
          }
          return dateToAssert
    }
}