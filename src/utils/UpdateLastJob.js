import fs from "fs";
const path = "./src/config/last_job.txt";

function getLastJobFromFile() {
  let lastJob = "No previous job recorded";
  if (fs.existsSync(path)) {
    lastJob = fs.readFileSync(path, "utf8");
  }
  return lastJob;
}

function writeLastJobToFile(jobTitle) {
  fs.writeFileSync(path, jobTitle);
}

export { getLastJobFromFile, writeLastJobToFile };
