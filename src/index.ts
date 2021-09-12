import TelegramBot from "node-telegram-bot-api";
import { chromium } from "playwright-chromium";
import config from "../config.json";

const TOAS_LOGIN_URL = "https://booking.toas.fi/auth/login";

export async function main() {
  const bot = new TelegramBot(config.TELEGRAM_BOT_TOKEN);
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(TOAS_LOGIN_URL);
  await page.type("#login", config.TOAS_USERNAME);
  await page.type("#password", config.TOAS_PASSWORD);
  await page.click("input[type=submit]");

  const currentDate = new Date();

  const day = `${currentDate.getDate()}`.padStart(2, "0");
  const month = `${currentDate.getMonth() + 1}`.padStart(2, "0");
  const year = `${currentDate.getFullYear()}`;

  await page.goto(
    `https://booking.toas.fi/varaus/service/timetable/625/${day}/${month}/${year}`
  );

  const table = await page.$(".calendar");
  if (table) {
    const screenshot = await table.screenshot();
    bot.sendPhoto(config.TELEGRAM_CHAT_ID, screenshot);
  }
  await browser.close();
}
main();
