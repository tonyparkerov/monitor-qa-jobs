import * as cheerio from "cheerio";
import { config } from "../config/config.js";
import Job from "../models/Job.js";
import JobFilter from "../filters/JobFilter.js";
import { createLogger } from "../utils/logger.js";

/**
 * Service for fetching and parsing job listings from DOU.ua
 */
export default class DouJobService {
  private url = config.dou.url;
  private queryParam = config.dou.queryParam;
  jobFilter = new JobFilter();
  private csrfToken: string | null = null;
  private logger = createLogger("DouJobService");

  async getJobs() {
    try {
      const htmlPage = await this.loadPage();
      const moreJobsJson = await this.loadMoreJobs();
      if (!htmlPage) return [];

      const jobs = this.parseJobs(htmlPage);
      const moreJobs = moreJobsJson ? this.parseMoreJobs(moreJobsJson) : [];
      return jobs.concat(moreJobs);
    } catch (error: any) {
      this.logger.error("Error getting jobs", new Error(error.message));
      return [];
    }
  }

  private async loadPage(): Promise<string | null> {
    try {
      const response = await fetch(`${this.url}${this.queryParam}`);
      this.extractCsrfToken(response);
      return await response.text();
    } catch (error: any) {
      this.logger.error("Error loading DOU.ua", new Error(error.message));
      return null;
    }
  }

  private extractCsrfToken(response: Response) {
    const cookies = response.headers.get("set-cookie");
    if (cookies) {
      const csrfMatch = cookies.match(/csrftoken=([^;]+)/);
      if (csrfMatch) {
        this.csrfToken = csrfMatch[1];
      }
    }
  }

  private async loadMoreJobs(count = 20) {
    if (!this.csrfToken) {
      this.logger.warn("CSRF token not available. Cannot load more jobs.");
      return null;
    }

    try {
      const response = await fetch(`${this.url}xhr-load/${this.queryParam}`, {
        method: "POST",
        headers: {
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          origin: "https://jobs.dou.ua",
          Cookie: `csrftoken=${this.csrfToken}`,
        },
        body: `csrfmiddlewaretoken=${this.csrfToken}&count=${count}`,
        redirect: "follow",
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      this.logger.error("Error loading more jobs", new Error(error.message));
      return null;
    }
  }

  private parseMoreJobs(response: any): Job[] {
    if (!response || !response.html) {
      return [];
    }

    // Create cheerio instance from the HTML string in the response
    const $ = cheerio.load(response.html);
    const jobs: Job[] = [];

    // Extract job data from each vacancy listing
    $(".l-vacancy").each((index, element) => {
      jobs.push(this.createJobFromElement($, element));
    });

    return jobs;
  }

  private parseJobs(htmlPage: string): Job[] {
    const $ = this.getVacancyList(htmlPage);
    const jobs: Job[] = [];

    $(".l-vacancy")
      .not(".__hot")
      .each((index, element) => {
        jobs.push(this.createJobFromElement($, element));
      });

    return jobs;
  }

  private getVacancyList(htmlPage: string) {
    const $ = cheerio.load(htmlPage);
    const vacancyList = $("div#vacancyListId").html() || "";
    return cheerio.load(vacancyList);
  }

  private createJobFromElement($: any, element: any): Job {
    const dateOfAdding = $(element).find(".date").text().trim();
    const title = $(element).find(".vt").text().trim();
    const companyName = $(element).find(".company").text().trim();
    const locations = $(element).find(".cities").text().trim();
    const jobLink = $(element).find(".vt").attr("href");
    const salary = $(element).find(".salary").text().trim() || "";

    return new Job(
      dateOfAdding,
      title,
      companyName,
      locations,
      jobLink,
      salary
    );
  }
}
