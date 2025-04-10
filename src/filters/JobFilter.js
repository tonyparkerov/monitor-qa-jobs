import { config } from "../config/config.js";

/**
 * Filter for job listings
 */
export default class JobFilter {
  constructor(excludedTerms = null) {
    this.excludedTerms = excludedTerms || config.filters.excludedTerms;
  }

  filterByLastJobFromDB(jobs, lastJobFromDB) {
    if (!jobs || jobs.length === 0 || !lastJobFromDB) {
      return jobs || [];
    }
    
    const indexOfLastJob = jobs.findIndex((job) => job.title === lastJobFromDB);
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
