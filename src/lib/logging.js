import winston from 'winston'
import morgan from 'morgan'
import 'winston-daily-rotate-file'
import 'winston-syslog'


const { combine, printf, errors, timestamp, colorize } = winston.format

// Format for logging
const formatLog = (info) => {
  const { timestamp, level, ...args } = info

  let message

  try {
    message = JSON.stringify(args) // Safely handle the message
  } catch (error) {
    message = args // Fallback if JSON.stringify fails
  }

  return `${timestamp} [ss-api][${process.env.NODE_ENV}][${level}]: ${message}`
}

// Determine log level based on environment
const getLogLevel = () => {
  if (process.env.NODE_ENV === 'development') {
    return 'debug' // In development, log debug messages
  }
  return 'info' // In all other environments (except test), log at 'info'
}

// Common transports
const transports = [
  new winston.transports.Console({
    level: getLogLevel(), // Set dynamic log level based on environment
    silent: process.env.NODE_ENV === 'test', // Suppress logs in test environment
    format: combine(
      colorize(),
      timestamp(),
      printf(formatLog)
    )
  }),
  new winston.transports.DailyRotateFile({
    level: process.env.NODE_ENV === 'test' ? 'error' : getLogLevel(), // Only log 'error' in test, else use dynamic level
    filename: 'app-%DATE%.log',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    dirname: 'logs'
  })
]

// Create logger
export const logger = winston.createLogger({
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3
    // Removed 'http' to be compatible with Syslog
  },
  format: combine(
    errors({ stack: true }),
    timestamp(),
    printf(formatLog)
  ),
  handleExceptions: true,
  handleRejections: true,
  transports
})

// HTTP Logger using morgan
export const httpLogger = morgan(
  function (tokens, req, res) {
    const log = {
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      status: tokens.status(req, res),
      contentLength: tokens.res(req, res, 'content-length'),
      responseTime: tokens['response-time'](req, res) + 'ms',
      remoteAddr: tokens['remote-addr'](req, res),
      userAgent: tokens['user-agent'](req, res)
    }

    return `method=${log.method} url=${log.url} status=${log.status} contentLength=${log.contentLength} responseTime=${log.responseTime}`
  },
  {
    stream: {
      write: (message) =>
        logger.info({ // Log HTTP requests at 'info' level
          message: message.trim()
        })
    }
  }
)
