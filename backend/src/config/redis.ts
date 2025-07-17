import { createClient, RedisClientType } from 'redis'
import logger from '../utils/logger'

let redisClient: RedisClientType

export async function connectRedis(): Promise<void> {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      password: process.env.REDIS_PASSWORD || undefined,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            logger.error('Redis reconnection limit reached')
            return new Error('Redis reconnection limit reached')
          }
          const delay = Math.min(retries * 100, 3000)
          logger.info(`Reconnecting to Redis in ${delay}ms...`)
          return delay
        }
      }
    })

    // Error handling
    redisClient.on('error', (err) => {
      logger.error('Redis client error:', err)
    })

    redisClient.on('connect', () => {
      logger.info('Redis client connected')
    })

    redisClient.on('ready', () => {
      logger.info('Redis client ready')
    })

    redisClient.on('reconnecting', () => {
      logger.warn('Redis client reconnecting')
    })

    // Connect
    await redisClient.connect()
    
    // Test connection
    await redisClient.ping()
    
  } catch (error) {
    logger.error('Failed to connect to Redis:', error)
    throw error
  }
}

export async function closeRedis(): Promise<void> {
  if (redisClient) {
    await redisClient.quit()
    logger.info('Redis connection closed')
  }
}

// Cache helpers
export const cache = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await redisClient.get(key)
      return value ? JSON.parse(value) : null
    } catch (error) {
      logger.error(`Cache get error for key ${key}:`, error)
      return null
    }
  },

  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      const serialized = JSON.stringify(value)
      if (ttl) {
        await redisClient.setEx(key, ttl, serialized)
      } else {
        await redisClient.set(key, serialized)
      }
    } catch (error) {
      logger.error(`Cache set error for key ${key}:`, error)
    }
  },

  async del(key: string): Promise<void> {
    try {
      await redisClient.del(key)
    } catch (error) {
      logger.error(`Cache delete error for key ${key}:`, error)
    }
  },

  async exists(key: string): Promise<boolean> {
    try {
      const result = await redisClient.exists(key)
      return result === 1
    } catch (error) {
      logger.error(`Cache exists error for key ${key}:`, error)
      return false
    }
  },

  async expire(key: string, ttl: number): Promise<void> {
    try {
      await redisClient.expire(key, ttl)
    } catch (error) {
      logger.error(`Cache expire error for key ${key}:`, error)
    }
  }
}

// Pub/Sub helpers
export const pubsub = {
  async publish(channel: string, message: any): Promise<void> {
    try {
      await redisClient.publish(channel, JSON.stringify(message))
    } catch (error) {
      logger.error(`Publish error for channel ${channel}:`, error)
    }
  },

  async subscribe(channel: string, callback: (message: any) => void): Promise<void> {
    const subscriber = redisClient.duplicate()
    await subscriber.connect()
    
    await subscriber.subscribe(channel, (message) => {
      try {
        const parsed = JSON.parse(message)
        callback(parsed)
      } catch (error) {
        logger.error(`Subscribe parse error for channel ${channel}:`, error)
      }
    })
  }
}

export { redisClient }