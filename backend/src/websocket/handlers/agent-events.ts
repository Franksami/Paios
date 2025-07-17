import { Socket, Server as SocketIOServer } from 'socket.io'
import logger from '../../utils/logger'
import { wsEmit } from '../server'
import { agentManager } from '../../agents/manager'
import { AgentCommand } from '@paios/shared'

interface AuthenticatedSocket extends Socket {
  userId?: string
  user?: any
}

interface AgentExecutePayload {
  agentNumber: number
  command: {
    action: string
    parameters: Record<string, any>
  }
}

export function setupAgentHandlers(socket: AuthenticatedSocket, io: SocketIOServer): void {
  const userId = socket.userId!
  // Execute agent command
  socket.on('agent:execute', async (payload: AgentExecutePayload, callback) => {
    try {
      logger.info('Agent execution requested', {
        userId,
        agentNumber: payload.agentNumber,
        action: payload.command.action
      })

      // Create agent command
      const command: AgentCommand = {
        ...payload.command,
        userId,
        requestId: `req-${Date.now()}`,
        timestamp: new Date()
      }

      // Execute through agent manager
      const response = await agentManager.executeCommand(
        userId,
        payload.agentNumber,
        command
      )

      // Send response
      callback?.({
        success: true,
        data: response
      })

      // Emit completion event
      wsEmit.toUser(io, userId, 'agent:response', {
        agentNumber: payload.agentNumber,
        response
      })

    } catch (error) {
      logger.error('Agent execution error:', error)
      
      callback?.({
        success: false,
        error: error instanceof Error ? error.message : 'Agent execution failed'
      })

      wsEmit.toUser(io, userId, 'agent:error', {
        agentNumber: payload.agentNumber,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  })

  // Get agent status
  socket.on('agent:status', async (agentNumber: number, callback) => {
    try {
      const info = agentManager.getAgentInfo(userId, agentNumber)
      
      callback?.({
        success: true,
        data: info || { initialized: false }
      })
    } catch (error) {
      callback?.({
        success: false,
        error: 'Failed to get agent status'
      })
    }
  })

  // Subscribe to agent updates
  socket.on('agent:subscribe', (agentNumber: number) => {
    const room = `agent:${userId}:${agentNumber}`
    socket.join(room)
    logger.info('Client subscribed to agent', {
      userId,
      agentNumber
    })
  })

  // Unsubscribe from agent updates
  socket.on('agent:unsubscribe', (agentNumber: number) => {
    const room = `agent:${userId}:${agentNumber}`
    socket.leave(room)
    logger.info('Client unsubscribed from agent', {
      userId,
      agentNumber
    })
  })

  // Process voice command
  socket.on('agent:voice', async (payload: {
    agentNumber: number
    text: string
  }, callback) => {
    try {
      logger.info('Agent voice command', {
        userId,
        agentNumber: payload.agentNumber,
        text: payload.text
      })

      const response = await agentManager.processVoiceCommand(
        userId,
        payload.agentNumber,
        payload.text
      )

      callback?.({
        success: true,
        data: response
      })
    } catch (error) {
      logger.error('Voice command error:', error)
      callback?.({
        success: false,
        error: error instanceof Error ? error.message : 'Voice command failed'
      })
    }
  })

  // Initialize agent
  socket.on('agent:initialize', async (payload: {
    agentNumber: number
    config?: any
  }, callback) => {
    try {
      const success = await agentManager.initializeAgent(
        userId,
        payload.agentNumber,
        payload.config
      )

      callback?.({
        success
      })
    } catch (error) {
      callback?.({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to initialize agent'
      })
    }
  })
}