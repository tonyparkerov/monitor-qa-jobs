import TelegramBot from "node-telegram-bot-api";
import config from "./config.js";

export function sendJobsMessage(message) {
  const bot = new TelegramBot(config.botToken, { polling: false });

  return bot.sendMessage(config.chatId, message, {
    parse_mode: "Markdown",
    disable_web_page_preview: true,
  });
}
