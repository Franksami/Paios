import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import app from './app'
import { connectDatabase } from './config/database'
import { connectRedis } from './config/redis'
import { setupWebSocket } from './websocket/server'
import logger from './utils/logger'

// Load environment variables
dotenv.config()

const PORT = process.env.PORT || 3001
const HOST = process.env.HOST || 'localhost'

async function startServer() {
  try {
    // Connect to databases
    await connectDatabase()
    await connectRedis()

    // Create HTTP server
    const server = createServer(app)

    // Setup WebSocket
    const io = new SocketIOServer(server, {
      cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        credentials: true,
      },
      pingInterval: parseInt(process.env.WS_PING_INTERVAL || '30000'),
      pingTimeout: parseInt(process.env.WS_PING_TIMEOUT || '5000'),
    })

    setupWebSocket(io)

    // Start server
    server.listen(PORT, () => {
      logger.info(`Server running on http://${HOST}:${PORT}`)
      logger.info(`WebSocket server ready`)
      logger.info(`Environment: ${process.env.NODE_ENV}`)
    })

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      logger.info('SIGTERM signal received: closing HTTP server')
      server.close(() => {
        logger.info('HTTP server closed')
      })
    })

  } catch (error) {
    logger.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()