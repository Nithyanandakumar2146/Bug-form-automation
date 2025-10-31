const { test, expect } = require('@playwright/test');
// Import your JSON data
const testData = require('../data-test.json'); 

test.describe('Bugs Form Tests', () => {

  let user;

  // Before each test, open the page
  test.beforeEach(async ({ page }) => {
    await page.goto('https://qa-practice.netlify.app/bugs-form');
    user = { ...testData.validUser }; // Load user data from JSON 
    await page.waitForTimeout(200); 
  });

  // 1. Empty fields and click register button
  test('Test empty fields ', async ({ page }) => {
    await page.click('#registerBtn');

    await page.screenshot({ path: 'screenshots/empty-fields.png' }); // take picture what error shows

    const passwordError = await page.locator('#message').innerText();
    console.log('Password error message:', passwordError); // print the error 
    expect(passwordError).toContain('6');
    await page.waitForTimeout(200); 
  });

  // 2. Invalid email with valid password
  test('Invalid email with valid password', async ({ page }) => {
    await page.fill('#firstName', user.firstName);
    await page.fill('#lastName', user.lastName);
    await page.fill('#phone', user.phone);
    await page.selectOption('#countries_dropdown_menu', user.country);
    await page.fill('#emailAddress', 'invalidEmail'); // override with invalid email
    await page.fill('#password', user.password);

    await page.click('#registerBtn');

    await page.screenshot({ path: 'screenshots/invalid-email.png' });

    const message = await page.locator('#message').innerText(); // print the innertext 
    console.log('Validation message:', message);
    // Notes: demo page allows registration even with invalid email
    expect(message).toContain('Successfully registered');
    await page.waitForTimeout(200); 
  });

  // 3. Valid registration using JSON
  test('Valid email and password - should register', async ({ page }) => {
    await page.fill('#firstName', user.firstName);
    await page.fill('#lastName', user.lastName);
    await page.fill('#phone', user.phone);
    await page.selectOption('#countries_dropdown_menu', user.country);
    await page.fill('#emailAddress', user.email);
    await page.fill('#password', user.password);

    await page.click('#registerBtn');

    await page.screenshot({ path: 'screenshots/valid-registration.png' });

    const message = await page.locator('#message').innerText();
    console.log('Form response:', message); // print the message after registeration 
    await page.waitForTimeout(200); 
  });

  // 4. Short password test
  test('Short password - should show error', async ({ page }) => { 
    await page.fill('#firstName', user.firstName);
    await page.fill('#lastName', user.lastName);
    await page.fill('#phone', user.phone);
    await page.fill('#emailAddress', user.email);
    await page.fill('#password', '123'); // short password

    await page.click('#registerBtn');

    await page.screenshot({ path: 'screenshots/short-password.png' });

    const passwordError = await page.locator('#message').innerText();
    console.log('Password validation message:', passwordError);
    expect(passwordError).toContain('6'); // if 3 letter psw- should shows error to validate. 
    await page.waitForTimeout(200); 
  });

  // 5. Short phone number test
  test('Short phone number - should show error', async ({ page }) => {
    await page.fill('#firstName', user.firstName);
    await page.fill('#lastName', user.lastName);
    await page.fill('#phone', '12345'); // too short - need 10 number to validate
    await page.fill('#emailAddress', user.email);
    await page.fill('#password', user.password);

    await page.click('#registerBtn');

    await page.screenshot({ path: 'screenshots/short-phone.png' });

    const phoneError = await page.locator('#message').innerText();
    console.log('Phone validation message:', phoneError);
    expect(phoneError).toContain('10');
    await page.waitForTimeout(200); 
  });

});

