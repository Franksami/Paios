import { Router } from 'express'
import { pool } from '../config/database'
import { cache } from '../config/redis'
import os from 'os'

const router = Router()

// Basic health check
router.get('/', async (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// Detailed health check
router.get('/detailed', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      api: 'healthy',
      database: 'unknown',
      redis: 'unknown'
    },
    system: {
      platform: os.platform(),
      arch: os.arch(),
      nodeVersion: process.version,
      memory: {
        used: process.memoryUsage(),
        total: os.totalmem(),
        free: os.freemem()
      },
      cpu: {
        usage: process.cpuUsage(),
        cores: os.cpus().length
      }
    }
  }

  // Check database
  try {
    await pool.query('SELECT 1')
    health.services.database = 'healthy'
  } catch (error) {
    health.services.database = 'unhealthy'
    health.status = 'degraded'
  }

  // Check Redis
  try {
    await cache.set('health:check', Date.now(), 10)
    const value = await cache.get('health:check')
    if (value) {
      health.services.redis = 'healthy'
    } else {
      health.services.redis = 'unhealthy'
      health.status = 'degraded'
    }
  } catch (error) {
    health.services.redis = 'unhealthy'
    health.status = 'degraded'
  }

  const statusCode = health.status === 'healthy' ? 200 : 503
  res.status(statusCode).json(health)
})

// Liveness probe (for k8s)
router.get('/live', (req, res) => {
  res.status(200).send('OK')
})

// Readiness probe (for k8s)
router.get('/ready', async (req, res) => {
  try {
    // Check if essential services are ready
    await pool.query('SELECT 1')
    await cache.exists('test')
    res.status(200).send('OK')
  } catch (error) {
    res.status(503).send('Not Ready')
  }
})

export default router