import DouJobService from "./services/DouJobService.js";
import TelegramService from "./services/TelegramService.js";
import MessageFormatter from "./utils/MessageFormatter.js";
import JobFilter from "./filters/JobFilter.js";

/**
 * Main application class
 */
class JobMonitorApp {
  constructor() {
    this.jobFilter = new JobFilter();
    this.douJobService = new DouJobService(this.jobFilter);
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

      // Format message
      const message = this.messageFormatter.formatJobsMessage(jobs);

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