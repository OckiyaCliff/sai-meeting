// Simple logger for application events

export enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

export interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: Record<string, any>
}

export class Logger {
  private static instance: Logger
  private logBuffer: LogEntry[] = []
  private readonly MAX_BUFFER_SIZE = 100

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>): LogEntry {
    const timestamp = new Date().toISOString()
    const entry: LogEntry = { timestamp, level, message, context }

    // Log to console
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(`[${timestamp}] [${level.toUpperCase()}]: ${message}`, context)
        break
      case LogLevel.INFO:
        console.info(`[${timestamp}] [${level.toUpperCase()}]: ${message}`, context)
        break
      case LogLevel.WARN:
        console.warn(`[${timestamp}] [${level.toUpperCase()}]: ${message}`, context)
        break
      case LogLevel.ERROR:
        console.error(`[${timestamp}] [${level.toUpperCase()}]: ${message}`, context)
        break
    }

    // Add to buffer
    this.logBuffer.push(entry)

    // Trim buffer if it gets too large
    if (this.logBuffer.length > this.MAX_BUFFER_SIZE) {
      this.logBuffer = this.logBuffer.slice(-this.MAX_BUFFER_SIZE)
    }

    // In production, you might want to send logs to a service
    if (process.env.NODE_ENV === "production") {
      // Example: Send logs to a logging service
    }

    return entry
  }

  public debug(message: string, context?: Record<string, any>): LogEntry {
    return this.log(LogLevel.DEBUG, message, context)
  }

  public info(message: string, context?: Record<string, any>): LogEntry {
    return this.log(LogLevel.INFO, message, context)
  }

  public warn(message: string, context?: Record<string, any>): LogEntry {
    return this.log(LogLevel.WARN, message, context)
  }

  public error(message: string, context?: Record<string, any>): LogEntry {
    return this.log(LogLevel.ERROR, message, context)
  }

  public getRecentLogs(count = 10): LogEntry[] {
    return this.logBuffer.slice(-count)
  }

  public clearLogs(): void {
    this.logBuffer = []
  }
}

// Export a singleton instance
export const logger = Logger.getInstance()

