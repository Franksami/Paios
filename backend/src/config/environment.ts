import { z } from 'zod'
import dotenv from 'dotenv'
import logger from '../utils/logger'

// Load environment variables
dotenv.config()

// Environment variable schema
const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().transform(Number).default('3001'),
  HOST: z.string().default('localhost'),

  // Database
  DATABASE_URL: z.string().url().or(z.string().startsWith('postgresql://')),
  DATABASE_POOL_SIZE: z.string().transform(Number).default('20'),
  DATABASE_SSL: z.string().transform(val => val === 'true').default('false'),

  // Redis
  REDIS_URL: z.string().url().or(z.string().startsWith('redis://')),
  REDIS_PASSWORD: z.string().optional(),

  // Authentication
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('15m'),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default('7d'),
  SESSION_SECRET: z.string().min(32),

  // Encryption
  ENCRYPTION_KEY: z.string().length(32),
  BIOMETRIC_RP_ID: z.string().default('localhost'),
  BIOMETRIC_RP_NAME: z.string().default('PAIOS Development'),

  // External APIs
  OPENAI_API_KEY: z.string().startsWith('sk-').optional(),
  ANTHROPIC_API_KEY: z.string().startsWith('sk-ant-').optional(),
  ELEVENLABS_API_KEY: z.string().optional(),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('900000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default('1000'),

  // CORS
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  CORS_CREDENTIALS: z.string().transform(val => val === 'true').default('true'),

  // WebSocket
  WS_PING_INTERVAL: z.string().transform(Number).default('30000'),
  WS_PING_TIMEOUT: z.string().transform(Number).default('5000'),

  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  LOG_FORMAT: z.enum(['json', 'pretty']).default('json'),
  ENABLE_REQUEST_LOGGING: z.string().transform(val => val === 'true').default('true'),
})

// Validate environment variables
export function validateEnvironment() {
  try {
    const env = envSchema.parse(process.env)
    logger.info('Environment variables validated successfully')
    return env
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.error('Environment validation failed:', {
        errors: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message
        }))
      })
    }
    throw new Error('Invalid environment configuration')
  }
}

// Export validated environment
export const env = validateEnvironment()

// Type-safe environment access
export type Environment = z.infer<typeof envSchema>