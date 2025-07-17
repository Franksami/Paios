import { MCPAgent } from './base/mcp-agent'
import { createAgent } from './implementations'
import { AgentCommand, AgentResponse, AgentConfig } from '@paios/shared'
import logger from '@/utils/logger'
import { Server as SocketServer } from 'socket.io'
import { pool } from '@/config/database'

export class AgentManager {
  private agents: Map<string, MCPAgent> = new Map()
  private io: SocketServer | null = null

  constructor() {
    logger.info('AgentManager initialized')
  }

  setSocketServer(io: SocketServer) {
    this.io = io
  }

  async initializeAgent(userId: string, agentNumber: number, config?: AgentConfig): Promise<boolean> {
    const agentKey = `${userId}-${agentNumber}`
    
    try {
      // Check if agent is already initialized
      if (this.agents.has(agentKey)) {
        logger.warn(`Agent ${agentNumber} already initialized for user ${userId}`)
        return true
      }

      // Create agent instance
      const agent = createAgent(agentNumber)
      if (!agent) {
        throw new Error(`Agent implementation not found for agent number ${agentNumber}`)
      }

      // Load config from database if not provided
      if (!config) {
        const result = await pool.query(
          'SELECT config FROM agents WHERE user_id = $1 AND agent_number = $2',
          [userId, agentNumber]
        )
        
        config = result.rows[0]?.config || {}
      }

      // Initialize agent
      await agent.initialize(config)

      // Set up event listeners
      this.setupAgentEventListeners(agent, userId)

      // Store agent instance
      this.agents.set(agentKey, agent)

      logger.info(`Agent ${agentNumber} initialized successfully for user ${userId}`)
      return true
    } catch (error) {
      logger.error(`Failed to initialize agent ${agentNumber} for user ${userId}:`, error)
      return false
    }
  }

  async executeCommand(userId: string, agentNumber: number, command: AgentCommand): Promise<AgentResponse> {
    const agentKey = `${userId}-${agentNumber}`
    const agent = this.agents.get(agentKey)

    if (!agent) {
      // Try to initialize the agent
      const initialized = await this.initializeAgent(userId, agentNumber)
      if (!initialized) {
        return {
          success: false,
          error: 'Agent not initialized and failed to initialize',
          metadata: { agentNumber }
        }
      }
      
      // Get the newly initialized agent
      const newAgent = this.agents.get(agentKey)
      if (!newAgent) {
        return {
          success: false,
          error: 'Agent initialization succeeded but agent not found',
          metadata: { agentNumber }
        }
      }
      
      return newAgent.execute(command)
    }

    return agent.execute(command)
  }

  async processVoiceCommand(userId: string, agentNumber: number, text: string): Promise<string> {
    const agentKey = `${userId}-${agentNumber}`
    const agent = this.agents.get(agentKey)

    if (!agent) {
      return 'Agent not initialized. Please try again.'
    }

    return agent.processVoiceCommand(text)
  }

  async shutdownAgent(userId: string, agentNumber: number): Promise<void> {
    const agentKey = `${userId}-${agentNumber}`
    const agent = this.agents.get(agentKey)

    if (agent) {
      await agent.cleanup()
      this.agents.delete(agentKey)
      logger.info(`Agent ${agentNumber} shut down for user ${userId}`)
    }
  }

  async shutdownAllAgents(): Promise<void> {
    const shutdownPromises = Array.from(this.agents.entries()).map(async ([key, agent]) => {
      await agent.cleanup()
      this.agents.delete(key)
    })

    await Promise.all(shutdownPromises)
    logger.info('All agents shut down')
  }

  getAgentInfo(userId: string, agentNumber: number) {
    const agentKey = `${userId}-${agentNumber}`
    const agent = this.agents.get(agentKey)

    if (!agent) {
      return null
    }

    return agent.getInfo()
  }

  getUserAgents(userId: string) {
    const userAgents: any[] = []
    
    this.agents.forEach((agent, key) => {
      if (key.startsWith(`${userId}-`)) {
        userAgents.push(agent.getInfo())
      }
    })

    return userAgents
  }

  private setupAgentEventListeners(agent: MCPAgent, userId: string) {
    // Forward agent status updates to WebSocket
    agent.on('status', (status) => {
      if (this.io) {
        this.io.to(`user:${userId}`).emit('agent:status', status)
      }
    })

    // Forward inter-agent messages
    agent.on('message', async (message) => {
      logger.info('Inter-agent message:', message)
      
      // Find target agent and deliver message
      const targetKey = Array.from(this.agents.keys()).find(key => {
        const agent = this.agents.get(key)
        return agent && agent.name === message.to
      })

      if (targetKey) {
        const targetAgent = this.agents.get(targetKey)
        if (targetAgent) {
          // Emit event to target agent
          targetAgent.emit('message', message)
        }
      }
    })

    // Log any errors
    agent.on('error', (error) => {
      logger.error(`Agent ${agent.name} error:`, error)
    })
  }
}

// Create singleton instance
export const agentManager = new AgentManager()