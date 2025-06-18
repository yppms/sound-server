import { logger } from '../lib/logging.js'
import { ResponseError } from '../lib/response.js'

export const errorMiddleware = async (err, req, res, next) => {
  if (!err) {
    return next()
  }

  if (err instanceof ResponseError) {
    const errorResponse = {
      status: 'error',
      message: err.message
    }

    if (err.data !== null && err.data !== undefined) {
      errorResponse.data = err.data
    }

    return res.status(err.status).json(errorResponse)
  } else {
    logger.error(err)
    return res.status(500).json({
      status: 'error',
      message: 'internal server error'
    })
  }
}