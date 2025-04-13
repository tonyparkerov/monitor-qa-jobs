/**
 * Log levels for the application
 */
export enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
}

/**
 * Logger utility for consistent logging throughout the application
 */
export class Logger {
  constructor(private context: string) {}

  /**
   * Log a debug level message
   * @param message The message to log
   * @param data Additional data to log
   */
  debug(message: string, data?: any): void {
    this.log(LogLevel.DEBUG, message, data);
  }

  /**
   * Log an info level message
   * @param message The message to log
   * @param data Additional data to log
   */
  info(message: string, data?: any): void {
    this.log(LogLevel.INFO, message, data);
  }

  /**
   * Log a warning level message
   * @param message The message to log
   * @param data Additional data to log
   */
  warn(message: string, data?: any): void {
    this.log(LogLevel.WARN, message, data);
  }

  /**
   * Log an error level message
   * @param message The message to log
   * @param error Optional error object
   * @param data Additional data to log
   */
  error(message: string, error?: Error, data?: any): void {
    this.log(LogLevel.ERROR, message, {
      ...(data || {}),
      error: error?.stack || error?.message,
    });
  }

  /**
   * Internal logging method
   */
  private log(level: LogLevel, message: string, data?: any): void {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level}] [${this.context}]`;

    if (data) {
      const dataString =
        typeof data === "object"
          ? JSON.stringify(data, null, 2)
          : data.toString();
      console.log(`${prefix} ${message}\n${dataString}`);
    } else {
      console.log(`${prefix} ${message}`);
    }
  }
}

/**
 * Create a logger for the specified context
 * @param context The context for the logger
 * @returns A configured Logger instance
 */
export function createLogger(context: string): Logger {
  return new Logger(context);
}
