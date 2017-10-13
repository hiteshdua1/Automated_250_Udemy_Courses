const puppeteer = require('puppeteer');
const CREDS = require ('./credentials');

async function goFetch(browser,basePageUrl) {


  const redditPage = await browser.newPage();
  const LI_SELECTOR = '#siteTable li>a';
	
  await redditPage.goto(basePageUrl);
  
  let listLength = await redditPage.evaluate((sel) => {
      return document.querySelectorAll(sel).length;
    }, LI_SELECTOR);
  console.log(listLength);

  
  for (let i = 1; i <= listLength; i++) {
     console.log(" IN loop");
     let courseUrl = await redditPage.evaluate((sel,i) => {
        return document.querySelectorAll(sel)[i].getAttribute('href');
      }, LI_SELECTOR,i);
     console.log(courseUrl);
     const coursePage = await browser.newPage();
     await getMeThisCourse(coursePage,courseUrl)
  }


}

async function getMeThisCourse(coursePage,courseUrl) {
  
  const ENROLL_NOW_SELECTOR = '#udemy > div.main-content > div.full-width.full-width--streamer.streamer--complete > div > div:nth-child(2) > div.col-xxs-4.right-col.js-right-col > div > div.right-col__module > div.right-col__inner > div:nth-child(1) > div > div.buy-box__element.buy-box__element--buy-button > div > a';
 
  try {
  await coursePage.goto(courseUrl);

  await coursePage.click(ENROLL_NOW_SELECTOR);

  await coursePage.waitForNavigation();

  await coursePage.close();
  }
  catch(err){
      coursePage.close();
      console.log("Already Subscribed !");
  };
 
}

async function loginGoogle(){

  const browser = await puppeteer.launch({
    headless: false
  });

  const googlePage = await browser.newPage();
  await googlePage.goto("https://accounts.google.com");

  const USERNAME_SELECTOR = '#identifierId';
  const USERNAME_NEXPAGE = '#identifierNext > content';
  const PASSWORD_SELECTOR = '#password input';
  const PASSWORD_NEXPAGE = '#passwordNext > content';
  await googlePage.click(USERNAME_SELECTOR);
  await googlePage.type(CREDS.gmail_username);

  await googlePage.click(USERNAME_NEXPAGE);
  await googlePage.waitFor(1 * 1000);

  await googlePage.click(PASSWORD_SELECTOR);
  await googlePage.type(CREDS.gmail_password);

  await googlePage.click(PASSWORD_NEXPAGE);

  goFetch(browser,"https://www.reddit.com/r/learnprogramming/comments/75ovw4/250_free_udemy_course_coupons/");
}

loginGoogle();
