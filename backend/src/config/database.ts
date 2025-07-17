import { Pool, PoolConfig } from 'pg'
import logger from '../utils/logger'

const poolConfig: PoolConfig = {
  connectionString: process.env.DATABASE_URL,
  max: parseInt(process.env.DATABASE_POOL_SIZE || '20'),
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: process.env.DATABASE_SSL === 'true' ? {
    rejectUnauthorized: false
  } : false
}

export const pool = new Pool(poolConfig)

// Handle pool errors
pool.on('error', (err) => {
  logger.error('Unexpected database pool error', err)
})

// Test database connection
export async function connectDatabase(): Promise<void> {
  try {
    const client = await pool.connect()
    await client.query('SELECT 1')
    client.release()
    logger.info('Database connected successfully')
  } catch (error) {
    logger.error('Failed to connect to database:', error)
    throw error
  }
}

// Graceful shutdown
export async function closeDatabase(): Promise<void> {
  try {
    await pool.end()
    logger.info('Database pool closed')
  } catch (error) {
    logger.error('Error closing database pool:', error)
  }
}

// Query helper with logging
export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<{ rows: T[], rowCount: number }> {
  const start = Date.now()
  
  try {
    const result = await pool.query<T>(text, params)
    const duration = Date.now() - start
    
    logger.debug('Database query executed', {
      query: text,
      duration: `${duration}ms`,
      rows: result.rowCount
    })
    
    return result
  } catch (error) {
    logger.error('Database query error', {
      query: text,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    throw error
  }
}

// Transaction helper
export async function transaction<T>(
  callback: (client: any) => Promise<T>
): Promise<T> {
  const client = await pool.connect()
  
  try {
    await client.query('BEGIN')
    const result = await callback(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}