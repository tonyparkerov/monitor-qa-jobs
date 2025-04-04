import fs from "fs";
import path from "path";

/**
 * Manages storage and retrieval of the last processed job
 */
export default class JobStorage {
  /**
   * Creates a new JobStorage instance
   * @param {string} storagePath Path to the storage file
   */
  constructor(storagePath = "./src/config/last_job.txt") {
    this.storagePath = storagePath;
  }

  /**
   * Get the last job title from storage
   * @returns {string} Last job title or default message if not found
   */
  getLastJob() {
    try {
      if (fs.existsSync(this.storagePath)) {
        return fs.readFileSync(this.storagePath, "utf8").trim();
      }
    } catch (error) {
      console.error("Error reading last job:", error.message);
    }
    return "No previous job recorded";
  }

  /**
   * Save a job title to storage
   * @param {string} jobTitle Title of the job to save
   * @returns {boolean} True if successful, false otherwise
   */
  saveLastJob(jobTitle) {
    try {
      // Ensure the directory exists
      const directory = path.dirname(this.storagePath);
      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
      }

      fs.writeFileSync(this.storagePath, jobTitle);
      return true;
    } catch (error) {
      console.error("Error saving last job:", error.message);
      return false;
    }
  }
}

// Backward compatibility functions
const defaultStorage = new JobStorage();

export function getLastJobFromFile() {
  return defaultStorage.getLastJob();
}

export function writeLastJobToFile(jobTitle) {
  return defaultStorage.saveLastJob(jobTitle);
}
