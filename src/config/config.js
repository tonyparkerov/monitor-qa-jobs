import "dotenv/config";

/**
 * Application configuration
 */
export const config = {
  telegram: {
    botToken: process.env.BOT_TOKEN,
    chatId: process.env.CHAT_ID,
  },
  mongodb: {
    uri: process.env.MONGODB_URI,
    dbName: process.env.MONGODB_DB_NAME,
    collectionName: "last_job"
  },
  dou: {
    url: "https://jobs.dou.ua/vacancies/?remote&category=QA",
  },
  filters: {
    excludedTerms: [
      "Python",
      "Java",
      "C#",
      "офіс",
      "office",
      "Lead",
      "Leader",
      "Head",
      "Trainee",
      ".NET",
      "Mobile",
      "support",
      "iOS",
      "Android",
      "Hardware",
      "Miltech",
      "Intern",
    ],
  },
};
