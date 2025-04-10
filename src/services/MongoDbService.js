import { MongoClient } from "mongodb";

/**
 * Service for interacting with MongoDB
 */
export default class MongoDbService {
  #client;
  #uri;
  #dbName;
  #collectionName;

  constructor(mongoConfig) {
    this.#uri = mongoConfig.uri;
    this.#dbName = mongoConfig.dbName;
    this.#collectionName = mongoConfig.collectionName;
  }

  /**
   * Connect to the MongoDB database
   * @returns {Promise<boolean>} True if connected successfully
   */
  async connect() {
    try {
      if (!this.#uri) {
        throw new Error("MongoDB connection URI is not configured");
      }

      this.#client = new MongoClient(this.#uri);
      await this.#client.connect();
      console.log("Connected to MongoDB");
      return true;
    } catch (error) {
      console.error("Failed to connect to MongoDB:", error);
      return false;
    }
  }

  /**
   * Close the MongoDB connection
   */
  async close() {
    if (this.#client) {
      await this.#client.close();
      console.log("MongoDB connection closed");
    }
  }

  /**
   * Get the last job from the database
   * @returns {Promise<string|null>} The last job title or null if not found
   */
  async getLastJob() {
    try {
      if (!this.#client) {
        throw new Error("MongoDB client is not connected");
      }

      const db = this.#client.db(this.#dbName);
      const collection = db.collection(this.#collectionName);
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

  /**
   * Save or update the last job in the database
   * @param {string} jobTitle The title of the last job
   * @returns {Promise<boolean>} True if saved successfully
   */
  async saveLastJob(jobTitle) {
    try {
      if (!this.#client) {
        throw new Error("MongoDB client is not connected");
      }

      const db = this.#client.db(this.#dbName);
      const collection = db.collection(this.#collectionName);

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
