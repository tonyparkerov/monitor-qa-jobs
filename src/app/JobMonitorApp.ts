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
  private jobService = new DouJobService();
  private telegramService = new TelegramService();
  private mongoService = new MongoDbService(config.mongodb);
  private messageFormatter = new MessageFormatter();
  private logger = createLogger("JobMonitorApp");

  async run(): Promise<boolean> {
    try {
      const jobs = await this.jobService.getJobs();
      if (jobs.length === 0) {
        await this.telegramService.sendMessage("New jobs not found");
        return true;
      }

      // Get last job from DB
      let lastJobFromDB: JobFromDB | null = null;
      lastJobFromDB = await this.mongoService.getLastJob();

      if (
        jobs[0].title === lastJobFromDB?.jobTitle &&
        jobs[0].companyName === lastJobFromDB.companyName
      ) {
        await this.telegramService.sendMessage("New jobs not found");
        return true;
      }

      const filter = new JobFilter(jobs);
      const filteredJobs = filter
        .filterByLastJobFromDB(lastJobFromDB)
        .filterByTerms(config.filters.excludedTerms)
        .filterByCompanyName(config.filters.excludedCompanies)
        .getFilteredJobs();

      // Save the most recent job
      await this.mongoService.saveLastJob({
        jobTitle: jobs[0].title,
        companyName: jobs[0].companyName,
      });

      // Only proceed if we have jobs to report
      if (filteredJobs.length === 0) {
        this.logger.info("No new jobs to report after filtering");
        return true;
      }

      const message = this.messageFormatter.formatJobsMessage(filteredJobs);
      await this.telegramService.sendMessage(message);

      return true;
    } catch (error) {
      this.logger.error("Error running job monitor", error as Error);
      return false;
    }
  }
}
