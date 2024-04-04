const puppeteer = require("puppeteer");
const TelegramBot = require("node-telegram-bot-api");
const config = require("./config");

const bot = new TelegramBot(config.BOT_API_KEY, { polling: false });

const handleError = async (error, page) => {
  console.error("There has been a problem with your fetch operation:", error);
  const title = await page.$eval("title", (el) => el.text);
  await bot.sendMessage(
    config.BOT_CHAT_ID_CHANNEL,
    `Error 😢 with \n ${title}`
  );
  if (title.includes("Sign in")) {
    await loginToWebsite(page);
  }
};

const loginToWebsite = async (page) => {
  // Navigate to the sign in page
  console.log("\nLogging you in...")
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

  console.log("Logged in successfully! 🎉🎉🎉")
  readline.close();
};

const checkAppointmentAvailability = async (page) => {
  console.log("\nChecking for appointments 🔍 ...");
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
    console.log(message);
    await bot.sendMessage(config.BOT_CHAT_ID_CHANNEL, message);
  }
};

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  loginToWebsite(page)
    .then(() => checkAppointmentAvailability(page))
    .then(() => {
      setInterval(() => {
        checkAppointmentAvailability(page).catch((error) =>
          handleError(error, page)
        );
      }, 5 * 60 * 1000);
    })
    .catch((error) => {
      console.error(
        "There has been a problem with your login operation:",
        error
      );
    });
})();
