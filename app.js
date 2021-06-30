const puppeteer = require("puppeteer");
const fs = require("fs");
let {
  login,
  password,
  main_address,
  course_name,
  course_file,
  section_id,
} = require("./variables");
var course = JSON.parse(fs.readFileSync(`courses/${course_file}.json`, 'utf8'));

(async () => {
  const browser = await puppeteer.launch(/* { headless: false } */);
  let page = await browser.newPage();

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
  await page.goto(course_page_link);

  await page.click("#username");
  await page.keyboard.type(login);

  await page.click("#password");
  await page.keyboard.type(password);

  await page.click("#loginbtn", { waitUntil: "domcontentloaded" });

  // Edit mode
  await page.mouse.click(660, 160, {
    waitUntil: ["domcontentloaded", "networkidle0"],
  });
  await page.waitForTimeout(2000);

  // Set description
  let section_internal_id = await page.$eval(`#${section_id}`, (el) =>
    el
      .getAttribute("aria-labelledby")
      .replace("sectionid-", "")
      .replace("-title", "")
  );
  await page.goto(
    `${main_address}/course/editsection.php?id=${section_internal_id}&sr`
  );
  await page.click("#id_summary_editoreditable");
  await page.keyboard.type(course.description);
  await page.click("#id_submitbutton", { waitUntil: ["domcontentloaded", "networkidle0"] });

  // Screen end page
  await page.screenshot({ path: "screens/example.png" });

  await browser.close();
})();
