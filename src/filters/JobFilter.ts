import type Job from "../models/Job.js";
import { JobFromDB } from "../types/index.js";
import { createLogger } from "../utils/logger.js";

export default class JobFilter {
  private jobsToFilter: Job[];
  private logger = createLogger("JobFilter");

  constructor(jobsArray: Job[]) {
    this.jobsToFilter = jobsArray;
    this.logger.debug("Initialized job filter");
  }

  getFilteredJobs() {
    this.logger.debug(`${this.jobsToFilter.length} jobs remaining`);
    return this.jobsToFilter;
  }

  filterByLastJobFromDB(lastJobFromDB: JobFromDB | null) {
    if (this.jobsToFilter.length === 0) return this;
    const indexOfLastJob = this.jobsToFilter.findIndex(
      (job) =>
        job.title === lastJobFromDB?.jobTitle &&
        job.companyName === lastJobFromDB.companyName
    );
    if (indexOfLastJob > 0) {
      this.jobsToFilter = this.jobsToFilter.slice(0, indexOfLastJob);
      this.logger.debug(
        `Filtered by last job: ${this.jobsToFilter.length} jobs remaining`
      );
    }
    return this;
  }

  filterByTerms(excludedTerms: string[]) {
    this.logger.debug(
      `Terms in jobs titles to exclude: ${JSON.stringify(excludedTerms)}`
    );
    if (this.jobsToFilter.length === 0) return this;
    const result = this.jobsToFilter.filter(
      (job) => !this.isExcludedByTerms(excludedTerms, job)
    );
    this.jobsToFilter = result;
    this.logger.debug(
      `Filtered by terms: ${this.jobsToFilter.length} jobs remaining`
    );
    return this;
  }

  filterByCompanyName(excludedCompanies: string[]) {
    this.logger.debug(
      `Companies to exclude: ${JSON.stringify(excludedCompanies)}`
    );
    if (this.jobsToFilter.length === 0) return this;
    const result = this.jobsToFilter.filter(
      (job) => !this.isExcludedByCompanies(excludedCompanies, job)
    );
    this.jobsToFilter = result;
    this.logger.debug(
      `Filtered by company: ${this.jobsToFilter.length} jobs remaining`
    );
    return this;
  }

  private isExcludedByTerms(excludedTerms: string[], job: Job): boolean {
    const lowerCaseTitle = job.title.toLowerCase();
    return excludedTerms.some((term) =>
      lowerCaseTitle.includes(term.toLowerCase())
    );
  }

  private isExcludedByCompanies(
    excludedCompanies: string[],
    job: Job
  ): boolean {
    const lowerCaseCompany = job.companyName.toLowerCase();
    return excludedCompanies.some(
      (term) => lowerCaseCompany === term.toLowerCase()
    );
  }
}
