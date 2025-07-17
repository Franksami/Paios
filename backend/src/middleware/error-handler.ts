import { Request, Response, NextFunction } from 'express'
import logger from '../utils/logger'

interface CustomError extends Error {
  statusCode?: number
  code?: string
  details?: unknown
}

export function errorHandler(
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Log error details
  logger.error('Error occurred:', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    query: req.query,
    user: (req as any).user?.id
  })

  // Determine status code
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal Server Error'

  // Prepare error response
  const errorResponse: any = {
    error: {
      message,
      code: err.code || 'INTERNAL_ERROR',
      timestamp: new Date().toISOString()
    }
  }

  // Add details in development mode
  if (process.env.NODE_ENV === 'development') {
    errorResponse.error.stack = err.stack
    errorResponse.error.details = err.details
  }

  // Send error response
  res.status(statusCode).json(errorResponse)
}