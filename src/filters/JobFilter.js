import { config } from "../config/config.js";
import { getLastJobFromFile } from "../utils/UpdateLastJob.js";

/**
 * Filter for job listings
 */
export default class JobFilter {
  /**
   * Create a JobFilter instance
   * @param {Array<string>} excludedTerms Terms to exclude in job titles (optional)
   * @param {string} lastJob Title of the last processed job (optional)
   */
  constructor(excludedTerms = null, lastJob = null) {
    this.excludedTerms = excludedTerms || config.filters.excludedTerms;
    this.lastJob = lastJob || getLastJobFromFile();
  }

  /**
   * Filter jobs to include only those that appeared after the last recorded job
   * @param {Array<Job>} jobs List of jobs to filter
   * @returns {Array<Job>} Filtered list of jobs
   */
  filterByLastJobFromFile(jobs) {
    if (!jobs || jobs.length === 0 || !this.lastJob) {
      return jobs || [];
    }

    const indexOfLastJob = jobs.findIndex((job) => job.title === this.lastJob);
    return indexOfLastJob > 0 ? jobs.slice(0, indexOfLastJob) : jobs;
  }

  /**
   * Filter jobs based on excluded terms
   * @param {Array<Job>} jobs List of jobs to filter
   * @returns {Array<Job>} Filtered list of jobs
   */
  filterByTerms(jobs) {
    if (!jobs || jobs.length === 0) {
      return [];
    }

    return jobs.filter((job) => !this._isExcluded(job));
  }

  /**
   * Check if a job should be excluded based on its title
   * @param {Job} job Job to check
   * @returns {boolean} True if job should be excluded
   * @private
   */
  _isExcluded(job) {
    const lowerCaseTitle = job.title.toLowerCase();
    return this.excludedTerms.some((term) =>
      lowerCaseTitle.includes(term.toLowerCase())
    );
  }
}
