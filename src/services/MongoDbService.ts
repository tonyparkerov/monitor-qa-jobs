import { MongoClient } from "mongodb";
import { JobFromDB, MongoConfig } from "../types/index.js";
import { createLogger } from "../utils/logger.js";

/**
 * Service for interacting with MongoDB
 */
export default class MongoDbService {
  private uri: string;
  private dbName: string;
  private collection: string;
  private client: MongoClient;
  private logger = createLogger("MongoDbService");

  constructor(mongoConfig: MongoConfig) {
    this.uri = mongoConfig.uri;
    this.dbName = mongoConfig.dbName;
    this.collection = mongoConfig.collection;
    this.client = new MongoClient(this.uri);
  }

  async connect(): Promise<boolean> {
    try {
      if (!this.uri) {
        throw new Error("MongoDB connection URI is not configured");
      }
      await this.client.connect();
      this.logger.info("Connected to MongoDB");
      return true;
    } catch (error) {
      this.logger.error("Failed to connect to MongoDB", error as Error);
      return false;
    }
  }

  async close(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.logger.info("MongoDB connection closed");
    }
  }

  async getLastJob(): Promise<JobFromDB | null> {
    try {
      if (!this.client) {
        throw new Error("MongoDB client is not connected");
      }

      const db = this.client.db(this.dbName);
      const collection = db.collection(this.collection);
      const lastJobDoc = await collection.findOne({});

      if (lastJobDoc && lastJobDoc.jobTitle && lastJobDoc.companyName) {
        this.logger.info(
          `Retrieved last job from MongoDB: ${lastJobDoc.jobTitle} | ${lastJobDoc.companyName}`
        );
        return {
          jobTitle: lastJobDoc.jobTitle,
          companyName: lastJobDoc.companyName,
        };
      }

      this.logger.info("No last job found in MongoDB");
      return null;
    } catch (error) {
      this.logger.error("Failed to get last job from MongoDB", error as Error);
      return null;
    }
  }

  async saveLastJob(job: JobFromDB): Promise<boolean> {
    try {
      if (!this.client) {
        throw new Error("MongoDB client is not connected");
      }

      const db = this.client.db(this.dbName);
      const collection = db.collection(this.collection);

      // Use upsert to either update existing document or insert a new one
      const result = await collection.updateOne(
        {}, // empty filter to match any document
        {
          $set: {
            jobTitle: job.jobTitle,
            companyName: job.companyName,
            updatedAt: new Date(),
          },
        },
        { upsert: true }
      );

      if (result.modifiedCount > 0) {
        this.logger.info(
          `Last job updated in MongoDB: ${job.jobTitle} | ${job.companyName}`
        );
      } else if (result.upsertedCount > 0) {
        this.logger.info(
          `Last job inserted in MongoDB: ${job.jobTitle} | ${job.companyName}`
        );
      }

      return true;
    } catch (error) {
      this.logger.error("Failed to save last job to MongoDB", error as Error);
      return false;
    }
  }
}
