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

    let message = `📊 *DOU QA vacancies*\n\n`;

    jobs.forEach((job, index) => {
      if (index < 20) {
        message += `[${job.title}](${job.jobLink}) @ ${job.companyName}\n`;
        message += `🗓️ Posted: ${job.dateOfAdding}\n`;
        if (job.salary) {
          message += `📍 Locations: ${job.locations}\n`;
          message += `💰 Salary: ${job.salary}\n\n`;
        } else {
          message += `📍 Locations: ${job.locations}\n\n`;
        }
      }
    });
    return message;
  }
}
