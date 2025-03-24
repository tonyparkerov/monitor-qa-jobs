import fs from "fs";
const path = "./src/config/last_job.txt";

let lastJob = "No previous job recorded";
if (fs.existsSync(path)) {
  lastJob = fs.readFileSync(path, "utf8").trim();
}

const newLastJob = new Date().toISOString();
fs.writeFileSync(path, newLastJob);

export { lastJob, newLastJob };
