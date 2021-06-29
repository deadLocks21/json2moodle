const puppeteer = require("puppeteer");
let { login, password, main_address, course_name } = require("./variables");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Get the course
  await page.goto(main_address);
  let links = await page.$$eval("h3.coursename a", (els) =>
    els.map((el) => {
      return { course_name: el.innerHTML, link: el.getAttribute("href") };
    })
  );

  let course_page_link;
  for (let i = 0; i < links.length; ++i) {
    if (links[i].course_name == course_name) course_page_link = links[i].link;
  }

  if (course_page_link === undefined) {
    await browser.close();
    console.log(`The course ${course_name} doesn't exists ...`);
    return;
  }




  // Go to login page
  await page.goto(`${main_address}/login/index.php`);

  await page.click("#username");
  await page.keyboard.type(login);

  await page.click("#password");
  await page.keyboard.type(password);

  await page.click("#loginbtn");
  await page.waitForNavigation({ waitUntil: 'networkidle0' });



  // Screen end page
  await page.screenshot({ path: "screens/example.png" });

  await browser.close();
})();