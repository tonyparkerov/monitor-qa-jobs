import { config } from "../config/config.js";
import type Job from "../models/Job.js";

export default class JobFilter {
  excludedTerms: string[];
  excludedCompanies: string[];

  constructor(excludedTerms = [], excludedCompanies = []) {
    this.excludedTerms = excludedTerms || config.filters.excludedTerms;
    this.excludedCompanies =
      excludedCompanies || config.filters.excludedCompanies;
  }

  filterByLastJobFromDB(jobs: Job[], lastJobFromDB: string | null) {
    if (jobs.length === 0) return jobs || [];
    const indexOfLastJob = jobs.findIndex((job) => job.title === lastJobFromDB);
    return indexOfLastJob > 0 ? jobs.slice(0, indexOfLastJob) : jobs;
  }

  filterByTerms(jobs: Job[]) {
    return jobs.length === 0
      ? []
      : jobs.filter((job) => !this.isExcludedByTerms(job));
  }

  filterByCompanyName(jobs: Job[]) {
    return jobs.length === 0
      ? []
      : jobs.filter((job) => !this.isExcludedByCompanies(job));
  }

  private isExcludedByTerms(job: Job): boolean {
    const lowerCaseTitle = job.title.toLowerCase();
    return this.excludedTerms.some((term) =>
      lowerCaseTitle.includes(term.toLowerCase())
    );
  }

  private isExcludedByCompanies(job: Job): boolean {
    const lowerCaseCompany = job.companyName.toLowerCase();
    return this.excludedCompanies.some((term) =>
      lowerCaseCompany.includes(term.toLowerCase())
    );
  }
}
