import "dotenv/config";

export default {
  botToken: process.env.BOT_TOKEN,
  chatId: process.env.CHAT_ID,
  douUrl: "https://jobs.dou.ua/vacancies/?category=QA",
};

// Helper functions
export function formatJobsMessage(jobs) {
  if (!jobs || jobs.length === 0) {
    return "No QA jobs found.";
  }

  let message = `📊 *DOU QA vacancies*\n\n`;

  jobs.forEach((job, index) => {
    if (index < 10) {
      message += `[${job.title}](${job.jobLink}) @${job.companyName}\n`;
      message += `🗓️ Posted: ${job.dateOfAdding}\n`;
      message += `📍 Locations: ${job.locations}\n\n`;
    }
  });

  return message;
}
