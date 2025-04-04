import DouJobService from "./services/DouJobService.js";
import TelegramService from "./services/TelegramService.js";
import MessageFormatter from "./utils/MessageFormatter.js";
import JobStorage from "./utils/UpdateLastJob.js";

/**
 * Main application class
 */
class JobMonitorApp {
  /**
   * Create a new JobMonitorApp instance
   * @param {Object} options Configuration options
   */
  constructor(options = {}) {
    this.jobService = options.jobService || new DouJobService();
    this.messagingService =
      options.messagingService || TelegramService.getInstance();
    this.messageFormatter = options.messageFormatter || new MessageFormatter();
    this.jobStorage = options.jobStorage || new JobStorage();
    this.logger = options.logger || console;
  }

  /**
   * Run the job monitoring process
   * @returns {Promise<boolean>} True if process completed successfully
   */
  async run() {
    try {
      // Get jobs from service
      this.logger.log("Fetching jobs...");
      const jobs = await this.jobService.getJobs();
      if (!jobs || jobs.length === 0) {
        this.logger.log("No jobs found");
        return true; // Exit successfully, just no jobs
      }
      this.logger.log(`Found ${jobs.length} jobs`);

      // Process jobs through filters
      const processedJobs = this.jobService.processJobs(jobs);
      this.logger.log(`${processedJobs.length} jobs after filtering`);

      // Only proceed if we have jobs to report
      if (processedJobs.length === 0) {
        this.logger.log("No new jobs to report after filtering");
        return true;
      }

      // Save the most recent job
      if (jobs.length > 0) {
        this.jobStorage.saveLastJob(jobs[0].title);
      }

      // Format message
      const message = this.messageFormatter.formatJobsMessage(processedJobs);

      // Send message
      await this.messagingService.sendMessage(message);
      this.logger.log("Message sent successfully!");

      return true;
    } catch (error) {
      this.logger.error("Error running job monitor:", error);
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
