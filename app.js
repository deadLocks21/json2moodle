// const identifiers = require('./identifiers').identifiers;
const puppeteer = require('puppeteer');
const {login, password, main_address} = require('./variables');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://example.com');
  await page.screenshot({ path: 'screens/example.png' });

  await browser.close();

  console.log(login);
})();