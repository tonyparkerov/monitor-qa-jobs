import DouJobService from "./services/DouJobService.js";
import TelegramService from "./services/TelegramService.js";
import MessageFormatter from "./utils/MessageFormatter.js";
import {
  getLastJobFromFile,
  writeLastJobToFile,
} from "./utils/UpdateLastJob.js";

/**
 * Main application class
 */
class JobMonitorApp {
  constructor() {
    this.jobService = new DouJobService();
    this.telegramService = new TelegramService();
    this.messageFormatter = new MessageFormatter();
  }

  /**
   * Run the job monitoring process
   * @returns {Promise<boolean>} True if process completed successfully
   */
  async run() {
    try {
      // Get jobs from service
      console.log("Fetching jobs...");
      const jobs = await this.jobService.getJobs();
      if (!jobs || jobs.length === 0) {
        console.log("No jobs found");
        return true;
      }
      console.log(`Found ${jobs.length} jobs`);

      // Filter jobs by last known job
      const jobsFilteredByLast =
        this.jobService.jobFilter.filterByLastJobFromFile(jobs);

      // Filter jobs by excluded terms
      const filteredJobs =
        this.jobService.jobFilter.filterByTerms(jobsFilteredByLast);
      console.log(`${filteredJobs.length} jobs after filtering`);

      // Only proceed if we have jobs to report
      if (filteredJobs.length === 0) {
        console.log("No new jobs to report after filtering");
        return true;
      }

      // Save the most recent job
      if (jobs.length > 0) {
        writeLastJobToFile(jobs[0].title);
      }

      // Format message
      const message = this.messageFormatter.formatJobsMessage(filteredJobs);

      // Send message
      await this.telegramService.sendMessage(message);
      console.log("Message sent successfully!");

      return true;
    } catch (error) {
      console.error("Error running job monitor:", error);
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

// Export for testing
export default JobMonitorApp;
