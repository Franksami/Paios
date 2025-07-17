import { MCPAgent } from '../base/mcp-agent'
import { AgentCommand, AgentResponse, AgentConfig, VoicePattern } from '@paios/shared'
import { AGENT_NUMBERS, AGENT_NAMES } from '@paios/shared'
import { agentManager } from '../manager'

interface SystemMetrics {
  activeAgents: number
  totalMessages: number
  avgResponseTime: number
  memoryUsage: number
  uptime: number
  websocketConnections: number
}

interface AgentConnection {
  from: string
  to: string
  type: 'message' | 'data' | 'event'
  count: number
}

export class SystemArchitectureAgent extends MCPAgent {
  agentNumber = AGENT_NUMBERS.SYSTEM_ARCHITECTURE
  name = 'System Architecture'
  description = 'Real-time system visualization and monitoring'

  private metrics: SystemMetrics = {
    activeAgents: 0,
    totalMessages: 0,
    avgResponseTime: 0,
    memoryUsage: 0,
    uptime: 0,
    websocketConnections: 0
  }

  private connections: AgentConnection[] = []
  private messageLog: any[] = []
  private startTime = Date.now()

  async initialize(config: AgentConfig): Promise<void> {
    this.validateConfig(config)
    this.config = config

    // Set up voice commands
    this.voiceCommands = [
      {
        patterns: ['show system diagram', 'display architecture', 'system overview'],
        action: 'get_diagram',
        description: 'Display system architecture diagram'
      },
      {
        patterns: ['system health', 'performance metrics', 'system status'],
        action: 'get_metrics',
        description: 'Show system performance metrics'
      },
      {
        patterns: ['show connections', 'agent connections', 'communication map'],
        action: 'get_connections',
        description: 'Display agent communication paths'
      },
      {
        patterns: ['show data flow', 'trace data', 'data pipeline'],
        action: 'get_data_flow',
        description: 'Show how data flows through the system'
      },
      {
        patterns: ['active agents', 'running agents', 'agent status'],
        action: 'get_active_agents',
        description: 'List all active agents'
      }
    ]

    // Start monitoring
    this.startMonitoring()

    this.isInitialized = true
    this.log('info', 'System Architecture agent initialized')
    this.emitStatus('idle')
  }

  async execute(command: AgentCommand): Promise<AgentResponse> {
    this.checkInitialized()
    this.emitStatus('executing', { action: command.action })

    try {
      let result: any

      switch (command.action) {
        case 'get_diagram':
          result = await this.generateSystemDiagram()
          break
        case 'get_metrics':
          result = await this.getSystemMetrics()
          break
        case 'get_connections':
          result = await this.getAgentConnections()
          break
        case 'get_data_flow':
          result = await this.getDataFlow()
          break
        case 'get_active_agents':
          result = await this.getActiveAgents()
          break
        default:
          throw new Error(`Unknown action: ${command.action}`)
      }

      this.emitStatus('idle')
      return {
        success: true,
        data: result,
        metadata: {
          executionTime: Date.now() - command.timestamp.getTime(),
          agentNumber: this.agentNumber
        }
      }
    } catch (error: any) {
      this.emitStatus('error', { error: error.message })
      this.log('error', 'Command execution failed', { error: error.message, command })
      
      return {
        success: false,
        error: error.message,
        metadata: {
          executionTime: Date.now() - command.timestamp.getTime(),
          agentNumber: this.agentNumber
        }
      }
    }
  }

  private async generateSystemDiagram(): Promise<any> {
    // Update metrics
    this.updateMetrics()

    // Generate Mermaid diagram
    const diagram = `graph TB
    subgraph Frontend
      UI[Web UI]
      Voice[Voice Interface]
      State[State Management]
    end
    
    subgraph WebSocket
      WS[WebSocket Server]
      Auth[JWT Auth]
    end
    
    subgraph Backend
      AM[Agent Manager]
      API[REST API]
    end
    
    subgraph Agents
      ${this.generateAgentNodes()}
    end
    
    subgraph Database
      PG[(PostgreSQL)]
      Redis[(Redis Cache)]
    end
    
    UI --> WS
    Voice --> WS
    State --> WS
    WS --> Auth
    WS --> AM
    API --> AM
    AM --> Agents
    API --> PG
    AM --> Redis
    
    ${this.generateAgentConnections()}
    
    style UI fill:#f9f,stroke:#333,stroke-width:2px
    style Voice fill:#bbf,stroke:#333,stroke-width:2px
    style WS fill:#fbb,stroke:#333,stroke-width:2px
    style AM fill:#bfb,stroke:#333,stroke-width:2px`

    return {
      diagram,
      type: 'mermaid',
      metrics: this.metrics,
      timestamp: new Date()
    }
  }

  private generateAgentNodes(): string {
    const activeAgents = agentManager.getUserAgents('system')
    return activeAgents
      .map(agent => `A${agent.agentNumber}[${agent.name}]`)
      .join('\n      ')
  }

  private generateAgentConnections(): string {
    return this.connections
      .map(conn => {
        const fromNum = this.getAgentNumber(conn.from)
        const toNum = this.getAgentNumber(conn.to)
        return `A${fromNum} -->|${conn.count} msgs| A${toNum}`
      })
      .join('\n    ')
  }

  private getAgentNumber(agentName: string): number {
    const entry = Object.entries(AGENT_NAMES).find(([_, name]) => name === agentName)
    return entry ? parseInt(entry[0]) : 0
  }

  private async getSystemMetrics(): Promise<any> {
    this.updateMetrics()

    return {
      current: {
        ...this.metrics,
        uptime: Math.floor((Date.now() - this.startTime) / 1000),
        memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024, // MB
        formatted: {
          uptime: this.formatUptime(this.metrics.uptime),
          memory: `${Math.round(this.metrics.memoryUsage)} MB`,
          responseTime: `${this.metrics.avgResponseTime} ms`
        }
      },
      performance: {
        messagesPerMinute: this.calculateMessagesPerMinute(),
        avgProcessingTime: this.metrics.avgResponseTime,
        errorRate: this.calculateErrorRate()
      },
      resources: {
        cpu: process.cpuUsage(),
        memory: process.memoryUsage()
      }
    }
  }

  private async getAgentConnections(): Promise<any> {
    return {
      connections: this.connections,
      totalConnections: this.connections.length,
      mostActive: this.getMostActiveConnection(),
      connectionMap: this.buildConnectionMap()
    }
  }

  private async getDataFlow(): Promise<any> {
    const recentFlow = this.messageLog.slice(-20).map(log => ({
      from: log.from,
      to: log.to,
      action: log.action,
      timestamp: log.timestamp,
      duration: log.duration
    }))

    return {
      recentFlow,
      patterns: this.analyzeFlowPatterns(),
      bottlenecks: this.identifyBottlenecks()
    }
  }

  private async getActiveAgents(): Promise<any> {
    const agents = agentManager.getUserAgents('system')
    
    return {
      count: agents.length,
      agents: agents.map(agent => ({
        number: agent.agentNumber,
        name: agent.name,
        status: agent.isInitialized ? 'active' : 'inactive',
        voiceEnabled: agent.voiceEnabled
      }))
    }
  }

  private startMonitoring(): void {
    // Monitor inter-agent messages
    this.on('message', (message) => {
      this.logMessage(message)
      this.updateConnections(message.from, message.to)
    })

    // Update metrics periodically
    setInterval(() => {
      this.updateMetrics()
    }, 5000)
  }

  private updateMetrics(): void {
    const agents = agentManager.getUserAgents('system')
    this.metrics.activeAgents = agents.length
    this.metrics.uptime = Math.floor((Date.now() - this.startTime) / 1000)
    this.metrics.memoryUsage = Math.round(process.memoryUsage().heapUsed / 1024 / 1024)
  }

  private logMessage(message: any): void {
    this.messageLog.push({
      ...message,
      timestamp: new Date()
    })

    // Keep only last 1000 messages
    if (this.messageLog.length > 1000) {
      this.messageLog = this.messageLog.slice(-1000)
    }

    this.metrics.totalMessages++
  }

  private updateConnections(from: string, to: string): void {
    const existing = this.connections.find(
      conn => conn.from === from && conn.to === to
    )

    if (existing) {
      existing.count++
    } else {
      this.connections.push({
        from,
        to,
        type: 'message',
        count: 1
      })
    }
  }

  private formatUptime(seconds: number): string {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return `${hours}h ${minutes}m ${secs}s`
  }

  private calculateMessagesPerMinute(): number {
    const uptimeMinutes = this.metrics.uptime / 60
    return uptimeMinutes > 0 ? Math.round(this.metrics.totalMessages / uptimeMinutes) : 0
  }

  private calculateErrorRate(): number {
    // TODO: Track errors properly
    return 0
  }

  private getMostActiveConnection(): AgentConnection | null {
    return this.connections.reduce((prev, current) => 
      (prev && prev.count > current.count) ? prev : current
    , null as AgentConnection | null)
  }

  private buildConnectionMap(): Record<string, string[]> {
    const map: Record<string, string[]> = {}
    
    this.connections.forEach(conn => {
      if (!map[conn.from]) {
        map[conn.from] = []
      }
      if (!map[conn.from].includes(conn.to)) {
        map[conn.from].push(conn.to)
      }
    })

    return map
  }

  private analyzeFlowPatterns(): any {
    // Analyze common patterns in message flow
    const patterns: Record<string, number> = {}
    
    this.messageLog.forEach((log, index) => {
      if (index > 0) {
        const prev = this.messageLog[index - 1]
        const pattern = `${prev.action} -> ${log.action}`
        patterns[pattern] = (patterns[pattern] || 0) + 1
      }
    })

    return Object.entries(patterns)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([pattern, count]) => ({ pattern, count }))
  }

  private identifyBottlenecks(): any[] {
    // Identify slow operations
    const slowOps = this.messageLog
      .filter(log => log.duration && log.duration > 1000)
      .map(log => ({
        action: log.action,
        duration: log.duration,
        timestamp: log.timestamp
      }))
      .slice(-10)

    return slowOps
  }

  protected formatVoiceResponse(response: AgentResponse): string {
    if (!response.success) {
      return super.formatVoiceResponse(response)
    }

    const data = response.data

    if (data.diagram) {
      return 'I\'ve generated the system architecture diagram. You can see how all agents and components are connected.'
    }

    if (data.current && data.current.activeAgents !== undefined) {
      return `System status: ${data.current.activeAgents} active agents, ${data.current.formatted.uptime} uptime, ${data.current.formatted.memory} memory usage, ${data.current.formatted.responseTime} average response time.`
    }

    if (data.connections) {
      return `There are ${data.totalConnections} agent connections. ${
        data.mostActive ? `The most active connection is between ${data.mostActive.from} and ${data.mostActive.to} with ${data.mostActive.count} messages.` : ''
      }`
    }

    if (data.agents) {
      return `${data.count} agents are currently active: ${data.agents.map((a: any) => a.name).join(', ')}.`
    }

    return 'System architecture data retrieved successfully.'
  }

  async cleanup(): Promise<void> {
    this.isInitialized = false
    this.memory.clear()
    this.connections = []
    this.messageLog = []
    this.removeAllListeners()
    this.log('info', 'System Architecture agent cleaned up')
  }
}