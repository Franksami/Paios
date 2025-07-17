import { AgentCommand, AgentResponse, AgentConfig, VoicePattern } from '@paios/shared'
import logger from '@/utils/logger'
import { EventEmitter } from 'events'

export interface MCPAgentInterface {
  agentNumber: number
  name: string
  description: string
  
  initialize(config: AgentConfig): Promise<void>
  execute(command: AgentCommand): Promise<AgentResponse>
  cleanup(): Promise<void>
  processVoiceCommand?(text: string): Promise<string>
}

export abstract class MCPAgent extends EventEmitter implements MCPAgentInterface {
  abstract agentNumber: number
  abstract name: string
  abstract description: string

  protected config: AgentConfig = {}
  protected isInitialized = false
  protected voiceCommands: VoicePattern[] = []
  protected memory: Map<string, any> = new Map()

  constructor() {
    super()
    this.setMaxListeners(50) // Increase listener limit for complex agents
  }

  abstract initialize(config: AgentConfig): Promise<void>
  abstract execute(command: AgentCommand): Promise<AgentResponse>
  abstract cleanup(): Promise<void>

  // Voice command processing (optional override)
  async processVoiceCommand(text: string): Promise<string> {
    logger.info(`[${this.name}] Processing voice command: "${text}"`)
    
    const command = this.parseVoiceCommand(text)
    
    if (!command) {
      return `I didn't understand that command. Available commands: ${this.getAvailableCommands()}`
    }

    try {
      const response = await this.execute(command)
      return this.formatVoiceResponse(response)
    } catch (error) {
      logger.error(`[${this.name}] Voice command error:`, error)
      return 'I encountered an error processing your request. Please try again.'
    }
  }

  // Parse voice text into agent command
  protected parseVoiceCommand(text: string): AgentCommand | null {
    const normalizedText = text.toLowerCase().trim()
    
    for (const pattern of this.voiceCommands) {
      for (const patternString of pattern.patterns) {
        const regex = new RegExp(patternString, 'i')
        const match = normalizedText.match(regex)
        
        if (match) {
          const parameters: Record<string, any> = {}
          
          // Extract captured groups as parameters
          if (match.length > 1) {
            match.slice(1).forEach((value, index) => {
              parameters[`param${index + 1}`] = value
            })
          }
          
          // Merge with pattern parameters
          Object.assign(parameters, pattern.parameters || {})
          
          return {
            action: pattern.action,
            parameters,
            context: { voiceCommand: text },
            userId: 'voice-user', // TODO: Get actual user ID
            requestId: `voice-${Date.now()}`,
            timestamp: new Date()
          }
        }
      }
    }
    
    return null
  }

  // Format agent response for voice output
  protected formatVoiceResponse(response: AgentResponse): string {
    if (!response.success) {
      return `Error: ${response.error || 'Operation failed'}`
    }
    
    // Default formatting - agents should override for better responses
    if (typeof response.data === 'string') {
      return response.data
    }
    
    return 'Operation completed successfully.'
  }

  // Get list of available voice commands
  protected getAvailableCommands(): string {
    const commands = this.voiceCommands
      .map(cmd => cmd.patterns[0])
      .join(', ')
    
    return commands || 'No voice commands available'
  }

  // Send message to another agent
  protected async sendMessage(targetAgent: string, data: any): Promise<void> {
    this.emit('message', {
      from: this.name,
      to: targetAgent,
      data,
      timestamp: new Date()
    })
  }

  // Save to agent memory
  protected async saveMemory(key: string, value: any, ttl?: number): Promise<void> {
    this.memory.set(key, {
      value,
      timestamp: Date.now(),
      ttl
    })
    
    // Clean up expired entries
    this.cleanupMemory()
  }

  // Retrieve from agent memory
  protected async getMemory(key: string): Promise<any | null> {
    const entry = this.memory.get(key)
    
    if (!entry) return null
    
    // Check if expired
    if (entry.ttl && Date.now() - entry.timestamp > entry.ttl * 1000) {
      this.memory.delete(key)
      return null
    }
    
    return entry.value
  }

  // Clean up expired memory entries
  private cleanupMemory(): void {
    const now = Date.now()
    
    for (const [key, entry] of this.memory.entries()) {
      if (entry.ttl && now - entry.timestamp > entry.ttl * 1000) {
        this.memory.delete(key)
      }
    }
  }

  // Validate configuration
  protected validateConfig(config: AgentConfig): void {
    if (!config) {
      throw new Error('Configuration is required')
    }
    
    // Agents can override to add specific validation
  }

  // Emit status update
  protected emitStatus(status: 'idle' | 'executing' | 'error', details?: any): void {
    this.emit('status', {
      agentNumber: this.agentNumber,
      status,
      details,
      timestamp: new Date()
    })
  }

  // Log with agent context
  protected log(level: 'info' | 'warn' | 'error', message: string, meta?: any): void {
    const logMeta = {
      agent: this.name,
      agentNumber: this.agentNumber,
      ...meta
    }
    
    logger[level](`[Agent #${this.agentNumber}] ${message}`, logMeta)
  }

  // Check if agent is initialized
  protected checkInitialized(): void {
    if (!this.isInitialized) {
      throw new Error(`Agent ${this.name} is not initialized`)
    }
  }

  // Get agent info
  public getInfo() {
    return {
      agentNumber: this.agentNumber,
      name: this.name,
      description: this.description,
      isInitialized: this.isInitialized,
      voiceEnabled: this.voiceCommands.length > 0,
      voiceCommands: this.voiceCommands.map(cmd => ({
        patterns: cmd.patterns,
        description: cmd.description || cmd.action
      }))
    }
  }
}