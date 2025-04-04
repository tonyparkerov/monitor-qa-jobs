/**
 * Formats job data into readable messages
 */
export default class MessageFormatter {
  /**
   * Format jobs into a Telegram message
   * @param {Array<Job>} jobs List of jobs
   * @returns {string} Formatted message
   */
  formatJobsMessage(jobs) {
    if (!jobs || jobs.length === 0) {
      return "No QA jobs found.";
    }

    let message = "📊 *DOU QA vacancies*\n\n";
    const jobsToProcess = jobs.slice(0, 20);

    jobsToProcess.forEach((job) => {
      message += this._formatSingleJob(job);
    });

    return message;
  }

  /**
   * Format a single job into a message part
   * @param {Job} job Job to format
   * @returns {string} Formatted job text
   * @private
   */
  _formatSingleJob(job) {
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
