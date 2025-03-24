import * as cheerio from "cheerio";
import { config } from "../config/config.js";
import Job from "../models/Job.js";

/**
 * Service for fetching and parsing job listings from DOU.ua
 */
export default class DouJobService {
  constructor(jobFilter) {
    this.url = config.dou.url;
    this.jobFilter = jobFilter;
  }

  /**
   * Fetch and parse jobs from DOU.ua
   * @returns {Promise<Array<Job>>} List of job objects
   */
  async getJobs() {
    const htmlPage = await this._loadPage();
    if (!htmlPage) return [];

    const jobs = this._parseJobs(htmlPage);
    return this.jobFilter.filter(jobs);
  }

  /**
   * Load the DOU.ua jobs page
   * @returns {Promise<string|null>} HTML content or null if error
   * @private
   */
  async _loadPage() {
    try {
      const response = await fetch(this.url);
      const data = await response.text();
      return data;
    } catch (error) {
      console.error("Error loading DOU.ua:", error.message);
      return null;
    }
  }

  /**
   * Parse the HTML page to extract job listings
   * @param {string} htmlPage HTML content
   * @returns {Array<Job>} List of job objects
   * @private
   */
  _parseJobs(htmlPage) {
    const $ = this._getVacancyList(htmlPage);
    const jobs = [];

    $(".l-vacancy")
      .not(".__hot")
      .each((index, element) => {
        const dateOfAdding = $(element).find(".date").text();
        const title = $(element).find(".vt").text();
        const companyName = $(element).find(".company").text();
        const locations = $(element).find(".cities").text();
        const jobLink = $(element).find(".vt").attr("href");
        const salary = $(element).find(".salary").text();

        jobs.push(
          new Job(dateOfAdding, title, companyName, locations, jobLink, salary)
        );
      });

    return jobs;
  }

  /**
   * Extract the vacancy list from the HTML page
   * @param {string} htmlPage HTML content
   * @returns {CheerioAPI} Cheerio instance for the vacancy list
   * @private
   */
  _getVacancyList(htmlPage) {
    const $ = cheerio.load(htmlPage);
    const vacancyList = $("div#vacancyListId").html();
    return cheerio.load(vacancyList);
  }
}