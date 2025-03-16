import axios from "axios";
import * as cheerio from "cheerio";
import config from "./config.js";
import { EXCLUDE_VARS } from "./config.js";

async function loadDouJobsPage() {
  try {
    const response = await axios.get(config.douUrl);
    return response.data;
  } catch (error) {
    console.error("Error loading DOU.ua:", error.message);
    return null;
  }
}

function getVacancyList(htmlPage) {
  const $ = cheerio.load(htmlPage);
  const vacancyList = $("div#vacancyListId").html();
  return cheerio.load(vacancyList);
}

export async function parseJobs() {
  const douPage = await loadDouJobsPage();
  if (!douPage) return [];

  const $ = getVacancyList(douPage);
  const jobs = [];

  $(".l-vacancy")
    .not(".__hot")
    .each((index, element) => {
      const dateOfAdding = $(element).find(".date").text();
      const title = $(element).find(".vt").text();
      const companyName = $(element).find(".company").text();
      const locations = $(element).find(".cities").text();
      const jobLink = $(element).find(".vt").attr("href");

      jobs.push({
        dateOfAdding,
        title,
        companyName,
        locations,
        jobLink,
      });
    });

  // Filter out excluded vacancies
  const filteredJobs = filterExcludedVacancies(jobs);

  return filteredJobs;
}

function filterExcludedVacancies(jobs) {
  return jobs.filter((job) => {
    // Check if job title contains any excluded term
    return !EXCLUDE_VARS.some((term) => job.title.includes(term));
  });
}
