// MongoDB related types
export interface MongoConfig {
  uri: string;
  dbName: string;
  collection: string;
}

export type JobFromDB = {
  jobTitle: string;
  companyName: string;
};

// Telegram related types
export interface TelegramConfig {
  botToken: string;
  chatId: string | number;
}

// DOU related types
export interface DouConfig {
  url: string;
}

// Filters related types
export interface FiltersConfig {
  excludedTerms: string[];
  excludedCompanies: string[];
}

// Config type
export interface AppConfig {
  mongodb: MongoConfig;
  telegram: TelegramConfig;
  dou: DouConfig;
  filters: FiltersConfig;
}
