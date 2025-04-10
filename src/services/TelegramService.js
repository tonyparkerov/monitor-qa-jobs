import { Telegraf } from "telegraf";
import { config } from "../config/config.js";
import AbstractMessagingService from "./AbstractMessagingService.js";

/**
 * Service for sending messages via Telegram using Telegraf
 */
export default class TelegramService extends AbstractMessagingService {
  /**
   * Create a new TelegramService instance
   * @param {string} botToken Telegram bot token (optional)
   * @param {string} chatId Telegram chat ID (optional)
   */
  constructor(botToken = null, chatId = null) {
    super();
    this.botToken = botToken || config.telegram.botToken;
    this.chatId = chatId || config.telegram.chatId;
    this.bot = null;
  }

  /**
   * Initialize the Telegraf bot instance.
   */
  _initializeBot() {
    if (!this.bot && this.botToken) {
      this.bot = new Telegraf(this.botToken);
    } else if (!this.botToken) {
      console.error("Missing Telegram bot token");
    }
  }

  /**
   * Send a message to the configured Telegram chat
   * @param {string} message Message to send
   * @returns {Promise} Promise from the Telegraf API
   */
  async sendMessage(message) {
    this._initializeBot();
    if (!this.bot || !this.chatId) {
      console.error("Bot not initialized or missing chat ID");
      return null;
    }

    try {
      return await this.bot.telegram.sendMessage(this.chatId, message, {
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      });
    } catch (error) {
      console.error("Error sending Telegram message:", error);
      return null;
    }
  }
}
