import TelegramBot from "node-telegram-bot-api";
import { config } from "../config/config.js";
import AbstractMessagingService from "./AbstractMessagingService.js";

/**
 * Service for sending messages via Telegram
 */
export default class TelegramService extends AbstractMessagingService {
  static instance = null;

  /**
   * Get singleton instance of TelegramService
   * @returns {TelegramService} Singleton instance
   */
  static getInstance() {
    if (!TelegramService.instance) {
      TelegramService.instance = new TelegramService();
    }
    return TelegramService.instance;
  }

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
   * Initialize the Telegram bot
   * @returns {Promise<void>}
   */
  async initialize() {
    if (this.isConfigured() && !this.bot) {
      this.bot = new TelegramBot(this.botToken, { polling: false });
    }
  }

  /**
   * Check if the service is properly configured
   * @returns {boolean} True if bot token and chat ID are set
   */
  isConfigured() {
    return Boolean(this.botToken && this.chatId);
  }

  /**
   * Send a message to the configured Telegram chat
   * @param {string} message Message to send
   * @returns {Promise} Promise from the Telegram API
   */
  async sendMessage(message) {
    if (!this.isConfigured()) {
      console.error("Missing Telegram bot token or chat ID");
      return null;
    }

    try {
      await this.initialize();
      return await this.bot.sendMessage(this.chatId, message, {
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      });
    } catch (error) {
      console.error("Error sending Telegram message:", error);
      return null;
    }
  }
}
