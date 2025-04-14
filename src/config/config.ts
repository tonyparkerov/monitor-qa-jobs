import { AppConfig } from "../types/index.js";
import dotenv from 'dotenv';
dotenv.config();

export const config: AppConfig = {
  telegram: {
    botToken: process.env.BOT_TOKEN ?? "",
    chatId: process.env.CHAT_ID ?? "",
  },
  mongodb: {
    uri: process.env.MONGODB_URI ?? "",
    dbName: process.env.MONGODB_DB_NAME ?? "",
    collection: "last_job",
  },
  dou: {
    url: "https://jobs.dou.ua/vacancies/",
    queryParam: "?remote=&category=QA",
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
    excludedCompanies: []
  },
};
