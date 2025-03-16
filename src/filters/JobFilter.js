import { config } from "../config/config.js";

/**
 * Filter for job listings
 */
export default class JobFilter {
  constructor() {
    this.excludedTerms = config.filters.excludedTerms;
  }

  /**
   * Filter jobs based on configured criteria
   * @param {Array<Job>} jobs List of jobs to filter
   * @returns {Array<Job>} Filtered list of jobs
   */
  filter(jobs) {
    return jobs.filter((job) => !this._isExcluded(job));
  }

  /**
   * Check if a job should be excluded
   * @param {Job} job Job to check
   * @returns {boolean} True if job should be excluded
   * @private
   */
  _isExcluded(job) {
    return this.excludedTerms.some((term) => job.title.includes(term));
  }
}