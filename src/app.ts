import { config } from "./config/config.js";
import DouJobService from "./services/DouJobService.js";
import MongoDbService from "./services/MongoDbService.js";
import TelegramService from "./services/TelegramService.js";
import MessageFormatter from "./utils/MessageFormatter.js";

/**
 * Main application class
 */
export default class JobMonitorApp {
  private jobService: DouJobService;
  private telegramService: TelegramService;
  private mongoService: MongoDbService;
  private messageFormatter: MessageFormatter;

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
      let lastJobFromDB: string | null = "";
      if (connection) {
        lastJobFromDB = await this.mongoService.getLastJob();
      }

      console.log("Fetching jobs...");
      const jobs = await this.jobService.getJobs();
      if (!jobs || jobs.length === 0) {
        console.log("No jobs found");
        if (connection) await this.mongoService.close();
        return true;
      }
      console.log(`Found ${jobs.length} jobs`);

      // Filter jobs by last known job
      const jobsFilteredByLast =
        this.jobService.jobFilter.filterByLastJobFromDB(jobs, lastJobFromDB);

      // Filter jobs by excluded terms
      const filteredJobs =
        this.jobService.jobFilter.filterByTerms(jobsFilteredByLast);
      console.log(`${filteredJobs.length} jobs after filtering`);

      // Only proceed if we have jobs to report
      if (filteredJobs.length === 0) {
        console.log("No new jobs to report after filtering");
        if (connection) await this.mongoService.close();
        return true;
      }

      // Save the most recent job
      if (jobs.length > 0 && connection) {
        try {
          await this.mongoService.saveLastJob(jobs[0].title);
          console.log(`Saved new last job to MongoDB: ${jobs[0].title}`);
        } catch (dbError) {
          console.error("Error saving last job to MongoDB:", dbError);
        }
      }

      if (connection) {
        try {
          await this.mongoService.close();
        } catch (closeError) {
          console.error("Error closing MongoDB connection:", closeError);
        }
      }

      // Format message
      const message = this.messageFormatter.formatJobsMessage(filteredJobs);

      // Send message
      await this.telegramService.sendMessage(message);
      console.log("Message sent successfully!");

      return true;
    } catch (error) {
      console.error("Error running job monitor:", error);
      // Ensure MongoDB connection is closed in case of error
      if (this.mongoService) {
        try {
          await this.mongoService.close();
        } catch (closeError) {
          console.error("Error closing MongoDB connection:", closeError);
        }
      }
      return false;
    }
  }
}

// Create and run the application
const app = new JobMonitorApp();
app.run().then((success) => {
  if (success) {
    console.log("Job monitor execution completed successfully");
  } else {
    console.error("Job monitor execution failed");
    process.exit(1);
  }
});
