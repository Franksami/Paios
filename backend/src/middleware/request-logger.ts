import { Request, Response, NextFunction } from 'express'
import { v4 as uuidv4 } from 'uuid'
import logger from '../utils/logger'

// Extend Request to include request ID
declare global {
  namespace Express {
    interface Request {
      id: string
      startTime: number
    }
  }
}

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  // Assign unique request ID
  req.id = uuidv4()
  req.startTime = Date.now()

  // Log request
  logger.info('Incoming request', {
    requestId: req.id,
    method: req.method,
    path: req.path,
    query: req.query,
    ip: req.ip,
    userAgent: req.get('user-agent')
  })

  // Capture response
  const originalSend = res.send
  res.send = function(data: any): Response {
    res.send = originalSend
    
    const responseTime = Date.now() - req.startTime
    
    logger.info('Request completed', {
      requestId: req.id,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`
    })

    return res.send(data)
  }

  next()
}