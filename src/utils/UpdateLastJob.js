import fs from "fs";

const path = "./src/config/last_job.txt";

/**
 * Get the last job title from storage
 * @returns {string} Last job title or default message if not found
 */
function getLastJobFromFile() {
  let lastJob = "No previous job recorded";
  try {
    if (fs.existsSync(path)) {
      lastJob = fs.readFileSync(path, "utf8").trim();
    }
  } catch (error) {
    console.error("Error reading last job:", error.message);
  }
  return lastJob;
}

/**
 * Save a job title to storage
 * @param {string} jobTitle Title of the job to save
 */
function writeLastJobToFile(jobTitle) {
  try {
    fs.writeFileSync(path, jobTitle);
  } catch (error) {
    console.error("Error saving last job:", error.message);
  }
}

export { getLastJobFromFile, writeLastJobToFile };
