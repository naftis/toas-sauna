import TelegramBot from "node-telegram-bot-api";
import config from "../config.json";
import { exec } from "child_process";

const bot = new TelegramBot(config.TELEGRAM_BOT_TOKEN, {
  polling: true,
});

bot.onText(/\/start/, () => {
  exec("npm run start");
});
