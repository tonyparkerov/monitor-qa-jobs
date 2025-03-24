import TelegramBot from "node-telegram-bot-api";
import { config } from "../config/config.js";

/**
 * Service for sending messages via Telegram
 */
export default class TelegramService {
  constructor() {
    this.botToken = config.telegram.botToken;
    this.chatId = config.telegram.chatId;
  }

  /**
   * Send a message to the configured Telegram chat
   * @param {string} message Message to send
   * @returns {Promise} Promise from the Telegram API
   */
  async sendMessage(message) {
    if (!this.botToken || !this.chatId) {
      console.error("Missing Telegram bot token or chat ID");
      return;
    }

    try {
      const bot = new TelegramBot(this.botToken, { polling: false });
      return bot.sendMessage(this.chatId, message, {
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      });
    } catch (error) {
      console.error("Error sending Telegram message:", error);
    }
  }
}
