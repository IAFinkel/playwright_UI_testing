import { test } from "../test-options";
import {faker} from '@faker-js/faker'


test("parametrized method", async ({ pagemanager }) => {
  const randomFullName= faker.person.fullName()
  const randomEmailBasedOnName =`${randomFullName.replace(' ','')}${faker.number.int(1000)}@test.com` 

  await pagemanager
    .onFormLayoutPage()
    .submitUsingTheGridForm(process.env.USERNAME, process.env.PASSWORD, "Option 1");

    await pagemanager.onFormLayoutPage().submitInlineForm(randomFullName, randomEmailBasedOnName, false)
});

