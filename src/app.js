import DouJobService from "./services/DouJobService.js";
import TelegramService from "./services/TelegramService.js";
import MessageFormatter from "./utils/MessageFormatter.js";
import { writeLastJobToFile } from "./utils/UpdateLastJob.js";

/**
 * Main application class
 */
class JobMonitorApp {
  constructor() {
    this.douJobService = new DouJobService();
    this.telegramService = new TelegramService();
    this.messageFormatter = new MessageFormatter();
  }

  /**
   * Run the job monitoring process
   */
  async run() {
    try {
      // Get jobs from DOU.ua
      const jobs = await this.douJobService.getJobs();
      if (jobs.length === 0) {
        console.log("No jobs found");
        return; // Exit early
      }

      const jobsFilteredByLast =
        this.douJobService.jobFilter.filterByLastJobFromFile(jobs);
      const jobsFilteredByTerms =
        this.douJobService.jobFilter.filterByTerms(jobsFilteredByLast);

      writeLastJobToFile(jobs[0].title);

      // Format message
      const message =
        this.messageFormatter.formatJobsMessage(jobsFilteredByTerms);

      // Send message
      await this.telegramService.sendMessage(message);

      console.log("Message sent successfully!");
    } catch (error) {
      console.error("Error running job monitor:", error);
    }
  }
}

// Create and run the application
const app = new JobMonitorApp();
app.run().then(() => {
  console.log("Job monitor execution completed");
});
