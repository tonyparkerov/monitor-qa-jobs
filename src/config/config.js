import "dotenv/config";

/**
 * Application configuration
 */
export const config = {
  telegram: {
    botToken: process.env.BOT_TOKEN,
    chatId: process.env.CHAT_ID,
  },
  dou: {
    url: "https://jobs.dou.ua/vacancies/?category=QA",
  },
  filters: {
    excludedTerms: ["Python", "Java", "C#", "офіс", "Lead", "Head"],
  },
};