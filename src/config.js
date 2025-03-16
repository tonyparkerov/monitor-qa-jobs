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

  let message = "📊 *QA Jobs from DOU.ua*\n\n";

  jobs.forEach((job) => {
    message += `[${job.title}](${job.jobLink})\n`;
    message += `🏢 ${job.companyName}\n`;
    message += `📅 ${job.dateOfAdding}\n\n`;
  });

  return message;
}
