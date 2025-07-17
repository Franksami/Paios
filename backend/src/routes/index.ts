import { Router } from 'express'
import agentRoutes from './agents'
import authRoutes from './auth'
import voiceRoutes from './voice'
import workflowRoutes from './workflows'
import systemRoutes from './system'
import credentialRoutes from './credentials'
import healthRoutes from './health'

const router = Router()

// Mount route modules
router.use('/agents', agentRoutes)
router.use('/auth', authRoutes)
router.use('/voice', voiceRoutes)
router.use('/workflows', workflowRoutes)
router.use('/system', systemRoutes)
router.use('/credentials', credentialRoutes)
router.use('/health', healthRoutes)

// Root API endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'PAIOS API',
    version: '1.0.0',
    endpoints: {
      agents: '/api/agents',
      auth: '/api/auth',
      voice: '/api/voice',
      workflows: '/api/workflows',
      system: '/api/system',
      credentials: '/api/credentials',
      health: '/api/health'
    }
  })
})

export default router