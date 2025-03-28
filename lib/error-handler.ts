// Error types
export enum ErrorType {
  AUTH = "auth",
  DATABASE = "database",
  NETWORK = "network",
  API = "api",
  VALIDATION = "validation",
  UNKNOWN = "unknown",
}

// Error severity levels
export enum ErrorSeverity {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
  CRITICAL = "critical",
}

// Error interface
export interface AppError {
  type: ErrorType
  message: string
  severity: ErrorSeverity
  originalError?: any
  context?: Record<string, any>
}

// Error handler class
export class ErrorHandler {
  // Log error to console and potentially to a monitoring service
  static logError(error: AppError) {
    const timestamp = new Date().toISOString()
    const errorDetails = {
      timestamp,
      type: error.type,
      severity: error.severity,
      message: error.message,
      context: error.context || {},
      originalError: error.originalError,
    }

    // Log to console
    console.error(`[${timestamp}] [${error.severity.toUpperCase()}] [${error.type}]: ${error.message}`, errorDetails)

    // In production, you would send this to a monitoring service like Sentry
    if (process.env.NODE_ENV === "production") {
      // Example: Sentry.captureException(error.originalError || error.message, { extra: errorDetails })
    }

    return errorDetails
  }

  // Create and log an error
  static handleError(
    type: ErrorType,
    message: string,
    severity: ErrorSeverity = ErrorSeverity.ERROR,
    originalError?: any,
    context?: Record<string, any>,
  ): AppError {
    const error: AppError = { type, message, severity, originalError, context }
    this.logError(error)
    return error
  }

  // Handle authentication errors
  static handleAuthError(message: string, originalError?: any, context?: Record<string, any>): AppError {
    return this.handleError(ErrorType.AUTH, message, ErrorSeverity.ERROR, originalError, context)
  }

  // Handle database errors
  static handleDatabaseError(message: string, originalError?: any, context?: Record<string, any>): AppError {
    return this.handleError(ErrorType.DATABASE, message, ErrorSeverity.ERROR, originalError, context)
  }

  // Handle network errors
  static handleNetworkError(message: string, originalError?: any, context?: Record<string, any>): AppError {
    return this.handleError(ErrorType.NETWORK, message, ErrorSeverity.ERROR, originalError, context)
  }

  // Handle API errors
  static handleApiError(message: string, originalError?: any, context?: Record<string, any>): AppError {
    return this.handleError(ErrorType.API, message, ErrorSeverity.ERROR, originalError, context)
  }

  // Handle validation errors
  static handleValidationError(message: string, originalError?: any, context?: Record<string, any>): AppError {
    return this.handleError(ErrorType.VALIDATION, message, ErrorSeverity.WARNING, originalError, context)
  }

  // Get user-friendly error message
  static getUserFriendlyMessage(error: AppError): string {
    switch (error.type) {
      case ErrorType.AUTH:
        return "Authentication error. Please sign in again."
      case ErrorType.DATABASE:
        return "Database error. Please try again later."
      case ErrorType.NETWORK:
        return "Network error. Please check your connection."
      case ErrorType.API:
        return "API error. Please try again later."
      case ErrorType.VALIDATION:
        return error.message || "Validation error. Please check your input."
      default:
        return "An unexpected error occurred. Please try again later."
    }
  }
}

