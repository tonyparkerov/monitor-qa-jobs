import { config } from "../config/config.js";
import JobFilter from "../filters/JobFilter.js";
import DouJobService from "../services/DouJobService.js";
import MongoDbService from "../services/MongoDbService.js";
import TelegramService from "../services/TelegramService.js";
import { JobFromDB } from "../types/index.js";
import MessageFormatter from "../utils/MessageFormatter.js";
import { createLogger } from "../utils/logger.js";

/**
 * Main application class
 */
export default class JobMonitorApp {
  private jobService: DouJobService;
  private telegramService: TelegramService;
  private mongoService: MongoDbService;
  private messageFormatter: MessageFormatter;
  private logger = createLogger("JobMonitorApp");

  constructor() {
    this.jobService = new DouJobService();
    this.telegramService = new TelegramService();
    this.mongoService = new MongoDbService(config.mongodb);
    this.messageFormatter = new MessageFormatter();
  }

  async run(): Promise<boolean> {
    try {
      // Get jobs from service
      const connection = await this.mongoService.connect();
      let lastJobFromDB: JobFromDB | null = null;
      if (connection) {
        lastJobFromDB = await this.mongoService.getLastJob();
      }

      this.logger.info("Fetching jobs...");
      const jobs = await this.jobService.getJobs();
      if (jobs.length === 0) {
        this.logger.info("No jobs found");
        if (connection) await this.mongoService.close();
        return true;
      }
      this.logger.info(`Found ${jobs.length} jobs`);

      const filter = new JobFilter(jobs);
      const filteredJobs = filter
        .filterByLastJobFromDB(lastJobFromDB)
        .filterByTerms(config.filters.excludedTerms)
        .filterByCompanyName(config.filters.excludedCompanies)
        .getFilteredJobs();

      // Only proceed if we have jobs to report
      if (filteredJobs.length === 0) {
        this.logger.info("No new jobs to report after filtering");
        if (connection) await this.mongoService.close();
        return true;
      }

      // Save the most recent job
      if (jobs.length > 0 && connection) {
        try {
          await this.mongoService.saveLastJob({
            jobTitle: jobs[0].title,
            companyName: jobs[0].companyName,
          });
        } catch (dbError) {
          this.logger.error(
            "Error saving last job to MongoDB",
            dbError as Error
          );
        }
      }

      if (connection) {
        try {
          await this.mongoService.close();
        } catch (closeError) {
          this.logger.error(
            "Error closing MongoDB connection",
            closeError as Error
          );
        }
      }

      // Format message
      const message = this.messageFormatter.formatJobsMessage(filteredJobs);

      // Send message
      await this.telegramService.sendMessage(message);
      this.logger.info("Message sent successfully!");

      return true;
    } catch (error) {
      this.logger.error("Error running job monitor", error as Error);
      // Ensure MongoDB connection is closed in case of error
      if (this.mongoService) {
        try {
          await this.mongoService.close();
        } catch (closeError) {
          this.logger.error(
            "Error closing MongoDB connection",
            closeError as Error
          );
        }
      }
      return false;
    }
  }
}
