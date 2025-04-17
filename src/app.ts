import JobMonitorApp from "./app/JobMonitorApp.js";
import { createLogger } from "./utils/logger.js";

// Create and run the application
const appLogger = createLogger("App");
const app = new JobMonitorApp();
app.run().then((success) => {
  if (success) {
    appLogger.info("Job monitor execution completed successfully");
  } else {
    appLogger.error("Job monitor execution failed");
    process.exit(1);
  }
});
