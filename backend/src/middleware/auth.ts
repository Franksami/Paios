import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import logger from '../utils/logger'

interface JwtPayload {
  id: string
  email: string
  iat?: number
  exp?: number
}

interface AuthRequest extends Request {
  user?: JwtPayload
}

export function authenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    res.status(401).json({
      error: {
        message: 'Access token required',
        code: 'MISSING_TOKEN'
      }
    })
    return
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'default-secret'
    ) as JwtPayload

    req.user = decoded
    next()
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        error: {
          message: 'Token expired',
          code: 'TOKEN_EXPIRED'
        }
      })
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(403).json({
        error: {
          message: 'Invalid token',
          code: 'INVALID_TOKEN'
        }
      })
    } else {
      res.status(500).json({
        error: {
          message: 'Token verification failed',
          code: 'TOKEN_VERIFICATION_ERROR'
        }
      })
    }
  }
}

export function optionalAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    next()
    return
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'default-secret'
    ) as JwtPayload

    req.user = decoded
  } catch (error) {
    // Log error but continue without user
    logger.warn('Optional auth token verification failed:', error)
  }

  next()
}

export function requireRole(role: string) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: {
          message: 'Authentication required',
          code: 'AUTH_REQUIRED'
        }
      })
      return
    }

    // TODO: Implement role checking logic
    // For now, all authenticated users pass
    next()
  }
}