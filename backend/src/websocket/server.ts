import { Server as SocketIOServer, Socket } from 'socket.io'
import { Server as HTTPServer } from 'http'
import jwt from 'jsonwebtoken'
import logger from '../utils/logger'
import { setupAgentHandlers } from './handlers/agent-events'
import { setupVoiceHandlers } from './handlers/voice-events'
import { setupSystemHandlers } from './handlers/system-events'
import { setupWorkflowHandlers } from './handlers/workflow-events'
import { agentManager } from '../agents/manager'

interface AuthenticatedSocket extends Socket {
  userId?: string
  user?: any
}

export function setupWebSocket(io: SocketIOServer): void {
  // Set socket server in agent manager
  agentManager.setSocketServer(io)
  
  // Authentication middleware
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1]
      
      if (!token) {
        return next(new Error('Authentication required'))
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as any
      socket.userId = decoded.id
      socket.user = decoded
      
      logger.info('WebSocket client authenticated', {
        userId: decoded.id,
        socketId: socket.id
      })
      
      next()
    } catch (error) {
      logger.error('WebSocket authentication failed:', error)
      next(new Error('Authentication failed'))
    }
  })

  // Connection handler
  io.on('connection', (socket: AuthenticatedSocket) => {
    logger.info('WebSocket client connected', {
      socketId: socket.id,
      userId: socket.userId
    })

    // Join user-specific room
    if (socket.userId) {
      socket.join(`user:${socket.userId}`)
    }

    // Setup event handlers
    setupAgentHandlers(socket, io)
    setupVoiceHandlers(socket, io)
    setupSystemHandlers(socket, io)
    setupWorkflowHandlers(socket, io)

    // Ping-pong for connection health
    const pingInterval = setInterval(() => {
      socket.emit('ping')
    }, parseInt(process.env.WS_PING_INTERVAL || '30000'))

    // Handle disconnect
    socket.on('disconnect', (reason) => {
      logger.info('WebSocket client disconnected', {
        socketId: socket.id,
        userId: socket.userId,
        reason
      })
      clearInterval(pingInterval)
    })

    // Error handling
    socket.on('error', (error) => {
      logger.error('WebSocket error:', {
        socketId: socket.id,
        userId: socket.userId,
        error: error.message
      })
    })

    // Send initial connection success
    socket.emit('connected', {
      socketId: socket.id,
      userId: socket.userId
    })
  })

  // Global error handling
  io.on('error', (error) => {
    logger.error('WebSocket server error:', error)
  })
}

// Utility functions for emitting events
export const wsEmit = {
  // Emit to specific user
  toUser(io: SocketIOServer, userId: string, event: string, data: any): void {
    io.to(`user:${userId}`).emit(event, data)
  },

  // Emit to all users
  toAll(io: SocketIOServer, event: string, data: any): void {
    io.emit(event, data)
  },

  // Emit to all except sender
  broadcast(socket: Socket, event: string, data: any): void {
    socket.broadcast.emit(event, data)
  },

  // Emit to specific room
  toRoom(io: SocketIOServer, room: string, event: string, data: any): void {
    io.to(room).emit(event, data)
  }
}