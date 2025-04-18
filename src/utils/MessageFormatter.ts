import type Job from "../models/Job.js";
import { createLogger } from "./logger.js";

/**
 * Formats job data into readable messages
 */
export default class MessageFormatter {
  private logger = createLogger("MessageFormatter");

  formatJobsMessage(jobs: Job[], maxJobsCount = 30): string {
    if (jobs.length === 0) {
      this.logger.info("No jobs to format");
      return "No QA jobs found.";
    }

    let message = `📊 *DOU QA vacancies*(${jobs.length} found!)\n\n`;
    const jobsToProcess = jobs.slice(0, maxJobsCount);

    this.logger.info(`Formatting ${jobsToProcess.length} jobs for message`);
    jobsToProcess.forEach((job) => {
      message += this.formatSingleJob(job);
    });

    return message;
  }

  private formatSingleJob(job: Job): string {
    let jobText = `[${job.title}](${job.jobLink}) @ ${job.companyName}\n`;
    jobText += `🗓️ Posted: ${job.dateOfAdding}\n`;

    if (job.salary) {
      jobText += `📍 Locations: ${job.locations}\n`;
      jobText += `💰 Salary: ${job.salary}\n\n`;
    } else {
      jobText += `📍 Locations: ${job.locations}\n\n`;
    }

    return jobText;
  }
}
