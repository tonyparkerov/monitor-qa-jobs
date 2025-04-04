/**
 * Formats job data into readable messages
 */
export default class MessageFormatter {
  /**
   * Create a new MessageFormatter with optional configuration
   * @param {Object} options Formatting options
   * @param {number} options.maxJobs Maximum number of jobs to include in message
   * @param {string} options.headerText Header text for the message
   */
  constructor(options = {}) {
    this.maxJobs = options.maxJobs || 20;
    this.headerText = options.headerText || "📊 *DOU QA vacancies*\n\n";
  }

  /**
   * Format jobs into a Telegram message
   * @param {Array<Job>} jobs List of jobs
   * @returns {string} Formatted message
   */
  formatJobsMessage(jobs) {
    if (!jobs || jobs.length === 0) {
      return "No QA jobs found.";
    }

    let message = this.headerText;
    const jobsToProcess = jobs.slice(0, this.maxJobs);

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

  /**
   * Format jobs into HTML
   * @param {Array<Job>} jobs List of jobs
   * @returns {string} HTML formatted jobs
   */
  formatJobsHtml(jobs) {
    if (!jobs || jobs.length === 0) {
      return "<p>No QA jobs found.</p>";
    }

    let html = `<h2>DOU QA vacancies</h2><ul>`;
    const jobsToProcess = jobs.slice(0, this.maxJobs);

    jobsToProcess.forEach((job) => {
      html += `<li>
        <a href="${job.jobLink}" target="_blank">${job.title}</a> @ ${
        job.companyName
      }<br>
        Posted: ${job.dateOfAdding}<br>
        Locations: ${job.locations}
        ${job.salary ? `<br>Salary: ${job.salary}` : ""}
      </li>`;
    });

    html += "</ul>";
    return html;
  }
}
