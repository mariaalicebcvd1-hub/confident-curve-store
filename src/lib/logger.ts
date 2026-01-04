/**
 * Safe logger utility that prevents detailed error information from being
 * exposed in production while maintaining full logging capabilities in development.
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const isDev = import.meta.env.DEV;

/**
 * Logs messages with appropriate detail level based on environment.
 * In production, only generic messages are logged to prevent information leakage.
 * In development, full error details are logged for debugging.
 */
export const logger = {
  /**
   * Log informational messages
   */
  info: (message: string, data?: unknown): void => {
    if (isDev) {
      console.info(`[INFO] ${message}`, data ?? '');
    }
  },

  /**
   * Log warning messages
   */
  warn: (message: string, data?: unknown): void => {
    if (isDev) {
      console.warn(`[WARN] ${message}`, data ?? '');
    }
  },

  /**
   * Log error messages - in production, only the message is logged, not the error details
   */
  error: (message: string, error?: unknown): void => {
    if (isDev) {
      console.error(`[ERROR] ${message}`, error ?? '');
    }
    // In production, console.error calls are stripped by esbuild
    // If you need production error monitoring, integrate a service like Sentry here:
    // if (!isDev && error) {
    //   Sentry.captureException(error);
    // }
  },

  /**
   * Log debug messages - only in development
   */
  debug: (message: string, data?: unknown): void => {
    if (isDev) {
      console.debug(`[DEBUG] ${message}`, data ?? '');
    }
  },
};

export default logger;
