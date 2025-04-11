import type Job from "../models/Job.js";

/**
 * Formats job data into readable messages
 */
export default class MessageFormatter {
  formatJobsMessage(jobs: Job[], maxJobsCount = 20): string {
    if (jobs.length === 0) return "No QA jobs found.";

    let message = "📊 *DOU QA vacancies*\n\n";
    const jobsToProcess = jobs.slice(0, maxJobsCount);

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
