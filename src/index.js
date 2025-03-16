import { parseJobs } from "./douService.js";
import { sendJobsMessage } from "./telegramService.js";
import { formatJobsMessage } from "./config.js";

async function main() {
  try {
    // Get jobs from DOU.ua
    const jobs = await parseJobs();

    // Format message
    const message = formatJobsMessage(jobs);

    // Send message
    await sendJobsMessage(message);

    console.log("Message sent successfully!");
  } catch (error) {
    console.error("Error running bot:", error);
  }
}

// Run the main function
main().then(() => {
  console.log("Bot execution completed");
});
