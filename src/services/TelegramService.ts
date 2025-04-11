import { Telegraf } from "telegraf";
import { config } from "../config/config.js";

/**
 * Service for sending messages via Telegram using Telegraf
 */
export default class TelegramService {
  private botToken: string;
  private chatId: string | number;
  private bot: Telegraf | null;

  constructor(botToken = null, chatId = null) {
    this.botToken = botToken || config.telegram.botToken;
    this.chatId = chatId || config.telegram.chatId;
    this.bot = null;
  }

  private initializeBot() {
    if (!this.bot && this.botToken) {
      this.bot = new Telegraf(this.botToken);
    } else if (!this.botToken) {
      console.error("Missing Telegram bot token");
    }
  }

  async sendMessage(message: string) {
    this.initializeBot();
    if (!this.bot || !this.chatId) {
      console.error("Bot not initialized or missing chat ID");
      return null;
    }

    try {
      return await this.bot.telegram.sendMessage(this.chatId, message, {
        parse_mode: "Markdown",
        disable_notification: false,
        link_preview_options: { is_disabled: true },
      });
    } catch (error) {
      console.error("Error sending Telegram message:", error);
      return null;
    }
  }
}
