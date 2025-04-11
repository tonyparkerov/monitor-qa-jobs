import { MongoClient } from "mongodb";
import { MongoConfig } from "../types/index.js";

/**
 * Service for interacting with MongoDB
 */
export default class MongoDbService {
  private uri: string;
  private dbName: string;
  private collection: string;
  private client: MongoClient;

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
      console.log("Connected to MongoDB");
      return true;
    } catch (error) {
      console.error("Failed to connect to MongoDB:", error);
      return false;
    }
  }

  async close(): Promise<void> {
    if (this.client) {
      await this.client.close();
      console.log("MongoDB connection closed");
    }
  }

  async getLastJob(): Promise<string | null> {
    try {
      if (!this.client) {
        throw new Error("MongoDB client is not connected");
      }

      const db = this.client.db(this.dbName);
      const collection = db.collection(this.collection);
      const lastJobDoc = await collection.findOne({});

      if (lastJobDoc && lastJobDoc.jobTitle) {
        console.log(`Retrieved last job from MongoDB: ${lastJobDoc.jobTitle}`);
        return lastJobDoc.jobTitle;
      }

      console.log("No last job found in MongoDB");
      return null;
    } catch (error) {
      console.error("Failed to get last job from MongoDB:", error);
      return null;
    }
  }

  async saveLastJob(jobTitle: string): Promise<boolean> {
    try {
      if (!this.client) {
        throw new Error("MongoDB client is not connected");
      }

      const db = this.client.db(this.dbName);
      const collection = db.collection(this.collection);

      // Use upsert to either update existing document or insert a new one
      const result = await collection.updateOne(
        {}, // empty filter to match any document
        { $set: { jobTitle, updatedAt: new Date() } },
        { upsert: true }
      );

      if (result.modifiedCount > 0) {
        console.log(`Last job updated in MongoDB: ${jobTitle}`);
      } else if (result.upsertedCount > 0) {
        console.log(`Last job inserted in MongoDB: ${jobTitle}`);
      }

      return true;
    } catch (error) {
      console.error("Failed to save last job to MongoDB:", error);
      return false;
    }
  }
}
