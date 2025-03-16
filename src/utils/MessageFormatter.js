/**
 * Formats job data into readable messages
 */
class MessageFormatter {
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
      if (index < 10) {
        message += `[${job.title}](${job.jobLink}) @${job.companyName}\n`;
        message += `🗓️ Posted: ${job.dateOfAdding}\n`;
        message += `📍 Locations: ${job.locations}\n\n`;
      }
    });

    return message;
  }
}

export default MessageFormatter;
