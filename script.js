const puppeteer = require("puppeteer");
const TelegramBot = require("node-telegram-bot-api");
const config = require("./config");

const bot = new TelegramBot(config.BOT_API_KEY, { polling: false });
let browser;
let page;

const log = async (...args) => {
  const message = new Date().toLocaleString() + " " + args.join(" | ");
  console.log(message);
  await sendTelegramMessage(message);
};

const sendTelegramMessage = async (message) => {
  await bot.sendMessage(config.BOT_CHAT_ID_CHANNEL, message);
};

const handleAppointmentAvailabilityError = async (error) => {
  const title = await page.$eval("title", (el) => el.text);
  await log(`Error 😢 with \n ${title}`, error);
  if (title.includes("Sign in")) {
    await log("Logging you in again...");
    await loginToWebsite();
  }
};

const loginToWebsite = async () => {
  // Navigate to the sign in page
  await log("\nLogging you in...");
  await page.goto(config.URL_SIGN_IN);

  // Fill in the form fields
  await page.type('input[name="user[email]"]', config.EMAIL);
  await page.type('input[name="user[password]"]', config.PASSWORD);
  await page.click('input[name="policy_confirmed"]');

  // Submit the form
  await Promise.all([
    page.waitForNavigation(), // Wait for the next page to load
    page.click('input[type="submit"]'), // Click the submit button
  ]);

  await log("Logged in successfully! 🎉🎉🎉");
};

const checkAppointmentAvailability = async () => {
  await log("\nChecking for appointments 🔍 ...");
  // Now you can navigate to the second URL
  await page.goto(config.URL_PAYMENT);

  // Extract the title and first paragraph
  const title = await page.$eval("title", (el) => el.text);
  const firstParagraph = await page.$eval("p", (el) => el.textContent);
  const noAppointmentsAvailable = await page.$eval(
    "td.text-right",
    (el) => el.textContent
  );
  console.log(noAppointmentsAvailable);
  console.log(title);
  console.log(firstParagraph);

  if (noAppointmentsAvailable.includes(config.NO_APPOINTMENTS)) {
    const message = `No appointments available 😢. Re-trying in 5 minutes!\n ${config.URL_PAYMENT}`;
    console.log(message);
  } else {
    const message = `🔥🔥 Appointments available! 🔥🔥\n ${config.URL_PAYMENT}`;
    await log(message);
  }
};

(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();

  loginToWebsite()
    .then(() => {
      setInterval(() => {
        checkAppointmentAvailability().catch((error) =>
          handleAppointmentAvailabilityError(error)
        );
      }, 5 * 60 * 1000);
    })
    .catch(async (error) => {
      await log("There has been a problem with your login operation:", error);
    });
})();
