import * as cheerio from "cheerio";
import { config } from "../config/config.js";
import Job from "../models/Job.js";
import JobFilter from "../filters/JobFilter.js";
import AbstractJobService from "./AbstractJobService.js";

/**
 * Service for fetching and parsing job listings from DOU.ua
 */
export default class DouJobService extends AbstractJobService {
  constructor() {
    super();
    this.url = config.dou.url;
    this.jobFilter = new JobFilter();
    this.csrfToken = null;
  }

  /**
   * Fetch and parse jobs from DOU.ua
   * @returns {Promise<Array<Job>>} List of job objects
   */
  async getJobs() {
    try {
      const htmlPage = await this._loadPage();
      const moreJobsJson = await this._loadMoreJobs();
      if (!htmlPage) return [];

      const jobs = this._parseJobs(htmlPage);
      const moreJobs = moreJobsJson ? this._parseMoreJobs(moreJobsJson) : [];
      return jobs.concat(moreJobs);
    } catch (error) {
      console.error("Error getting jobs:", error.message);
      return [];
    }
  }

  /**
   * Load the DOU.ua jobs page
   * @returns {Promise<string|null>} HTML content or null if error
   * @private
   */
  async _loadPage() {
    try {
      const response = await fetch(this.url);
      this._extractCsrfToken(response);
      return await response.text();
    } catch (error) {
      console.error("Error loading DOU.ua:", error.message);
      return null;
    }
  }

  /**
   * Extract CSRF token from response headers
   * @param {Response} response The fetch response
   * @private
   */
  _extractCsrfToken(response) {
    const cookies = response.headers.get("set-cookie");
    if (cookies) {
      const csrfMatch = cookies.match(/csrftoken=([^;]+)/);
      if (csrfMatch) {
        this.csrfToken = csrfMatch[1];
      }
    }
  }

  /**
   * Send XHR request to load more jobs
   * @param {number} count Number of jobs to load
   * @returns {Promise<Object>} JSON response with jobs data
   * @private
   */
  async _loadMoreJobs(count = 20) {
    if (!this.csrfToken) {
      console.warn("CSRF token not available. Cannot load more jobs.");
      return null;
    }

    try {
      const response = await fetch(
        "https://jobs.dou.ua/vacancies/xhr-load/?category=QA",
        {
          method: "POST",
          headers: {
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            origin: "https://jobs.dou.ua",
            Cookie: `csrftoken=${this.csrfToken}`,
          },
          body: `csrfmiddlewaretoken=${this.csrfToken}&count=${count}`,
          redirect: "follow",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error loading more jobs:", error.message);
      return null;
    }
  }

  /**
   * Parse the JSON response from loadMoreJobs to extract job listings
   * @param {Object} response JSON response from loadMoreJobs
   * @returns {Array<Job>} List of job objects
   * @private
   */
  _parseMoreJobs(response) {
    if (!response || !response.html) {
      return [];
    }

    // Create cheerio instance from the HTML string in the response
    const $ = cheerio.load(response.html);
    const jobs = [];

    // Extract job data from each vacancy listing
    $(".l-vacancy").each((index, element) => {
      jobs.push(this._createJobFromElement($, element));
    });

    return jobs;
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
        jobs.push(this._createJobFromElement($, element));
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
    const vacancyList = $("div#vacancyListId").html() || "";
    return cheerio.load(vacancyList);
  }

  /**
   * Create a Job object from a DOM element
   * @param {CheerioAPI} $ Cheerio instance
   * @param {Element} element DOM element containing job data
   * @returns {Job} Job object
   * @private
   */
  _createJobFromElement($, element) {
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
