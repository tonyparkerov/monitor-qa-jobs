import { config } from "../config/config.js";
import type Job from "../models/Job.js";

export default class JobFilter {
  excludedTerms: string[];

  constructor(excludedTerms = []) {
    this.excludedTerms = excludedTerms || config.filters.excludedTerms;
  }

  filterByLastJobFromDB(jobs: Job[], lastJobFromDB: string | null) {
    if (jobs.length === 0) return jobs || [];
    const indexOfLastJob = jobs.findIndex((job) => job.title === lastJobFromDB);
    return indexOfLastJob > 0 ? jobs.slice(0, indexOfLastJob) : jobs;
  }

  filterByTerms(jobs: Job[]) {
    return jobs.length === 0 ? [] : jobs.filter((job) => !this.isExcluded(job));
  }

  private isExcluded(job: Job): boolean {
    const lowerCaseTitle = job.title.toLowerCase();
    return this.excludedTerms.some((term) =>
      lowerCaseTitle.includes(term.toLowerCase())
    );
  }
}
