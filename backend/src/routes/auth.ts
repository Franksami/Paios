import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { validate } from '../middleware/validation'
import { authRateLimiter } from '../middleware/rate-limit'
import { authenticateToken } from '../middleware/auth'
import { z } from 'zod'
import logger from '../utils/logger'

const router = Router()

// Validation schemas
const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6)
  })
})

const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6).max(100)
  })
})

const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string()
  })
})

// Generate tokens
function generateTokens(userId: string, email: string) {
  const accessToken = jwt.sign(
    { id: userId, email },
    process.env.JWT_SECRET || 'default-secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  )

  const refreshToken = jwt.sign(
    { id: userId, email, type: 'refresh' },
    process.env.JWT_SECRET || 'default-secret',
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' }
  )

  return { accessToken, refreshToken }
}

// Register
router.post(
  '/register',
  authRateLimiter,
  validate(registerSchema),
  async (req, res, next) => {
    try {
      const { email, password } = req.body

      // TODO: Check if user exists in database
      // const existingUser = await userService.findByEmail(email)
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10)

      // TODO: Create user in database
      // const user = await userService.create({ email, password: hashedPassword })
      
      // Mock user creation
      const user = {
        id: `user-${Date.now()}`,
        email,
        createdAt: new Date().toISOString()
      }

      // Generate tokens
      const tokens = generateTokens(user.id, user.email)

      logger.info('User registered', { userId: user.id, email: user.email })

      res.status(201).json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email
          },
          ...tokens
        }
      })
    } catch (error) {
      next(error)
    }
  }
)

// Login
router.post(
  '/login',
  authRateLimiter,
  validate(loginSchema),
  async (req, res, next) => {
    try {
      const { email, password } = req.body

      // TODO: Find user in database
      // const user = await userService.findByEmail(email)
      
      // Mock user lookup
      const user = {
        id: 'user-123',
        email,
        password: await bcrypt.hash('password123', 10) // Mock hashed password
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password)
      
      if (!isValidPassword) {
        return res.status(401).json({
          error: {
            message: 'Invalid credentials',
            code: 'INVALID_CREDENTIALS'
          }
        })
      }

      // Generate tokens
      const tokens = generateTokens(user.id, user.email)

      logger.info('User logged in', { userId: user.id, email: user.email })

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email
          },
          ...tokens
        }
      })
    } catch (error) {
      next(error)
    }
  }
)

// Refresh token
router.post(
  '/refresh',
  validate(refreshSchema),
  async (req, res, next) => {
    try {
      const { refreshToken } = req.body

      // Verify refresh token
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_SECRET || 'default-secret'
      ) as any

      if (decoded.type !== 'refresh') {
        return res.status(401).json({
          error: {
            message: 'Invalid refresh token',
            code: 'INVALID_TOKEN'
          }
        })
      }

      // Generate new tokens
      const tokens = generateTokens(decoded.id, decoded.email)

      res.json({
        success: true,
        data: tokens
      })
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        res.status(401).json({
          error: {
            message: 'Refresh token expired',
            code: 'TOKEN_EXPIRED'
          }
        })
      } else {
        next(error)
      }
    }
  }
)

// Logout
router.post('/logout', authenticateToken, async (req, res, next) => {
  try {
    const userId = (req as any).user.id

    // TODO: Invalidate refresh token in database/redis
    
    logger.info('User logged out', { userId })

    res.json({
      success: true,
      message: 'Logged out successfully'
    })
  } catch (error) {
    next(error)
  }
})

// Get current user
router.get('/me', authenticateToken, async (req, res, next) => {
  try {
    const userId = (req as any).user.id

    // TODO: Get user from database
    // const user = await userService.findById(userId)
    
    // Mock user data
    const user = {
      id: userId,
      email: (req as any).user.email,
      createdAt: new Date().toISOString()
    }

    res.json({
      success: true,
      data: user
    })
  } catch (error) {
    next(error)
  }
})

export default router