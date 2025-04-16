import { config } from "../config/config.js";
import type Job from "../models/Job.js";
import { JobFromDB } from "../types/index.js";
import { createLogger } from "../utils/logger.js";

export default class JobFilter {
  private excludedTerms: string[] = config.filters.excludedTerms;
  private excludedCompanies: string[] = config.filters.excludedCompanies;
  private logger = createLogger("JobFilter");

  constructor() {
    this.logger.debug("Initialized job filter", {
      excludedTerms: this.excludedTerms,
      excludedCompanies: this.excludedCompanies,
    });
  }

  filterByLastJobFromDB(jobs: Job[], lastJobFromDB: JobFromDB | null) {
    if (jobs.length === 0) return jobs || [];
    const indexOfLastJob = jobs.findIndex(
      (job) =>
        job.title === lastJobFromDB?.jobTitle &&
        job.companyName === lastJobFromDB.companyName
    );
    const result = indexOfLastJob > 0 ? jobs.slice(0, indexOfLastJob) : jobs;
    this.logger.debug(`Filtered by last job: ${result.length} jobs remaining`);
    return result;
  }

  filterByTerms(jobs: Job[]) {
    if (jobs.length === 0) return [];
    const result = jobs.filter((job) => !this.isExcludedByTerms(job));
    this.logger.debug(
      `Filtered by terms: ${result.length}/${jobs.length} jobs remaining`
    );
    return result;
  }

  filterByCompanyName(jobs: Job[]) {
    if (jobs.length === 0) return [];
    const result = jobs.filter((job) => !this.isExcludedByCompanies(job));
    this.logger.debug(
      `Filtered by company: ${result.length}/${jobs.length} jobs remaining`
    );
    return result;
  }

  private isExcludedByTerms(job: Job): boolean {
    const lowerCaseTitle = job.title.toLowerCase();
    return this.excludedTerms.some((term) =>
      lowerCaseTitle.includes(term.toLowerCase())
    );
  }

  private isExcludedByCompanies(job: Job): boolean {
    const lowerCaseCompany = job.companyName.toLowerCase();
    return this.excludedCompanies.some(
      (term) => lowerCaseCompany === term.toLowerCase()
    );
  }
}
