export interface MCPMessage {
  id: string
  from: string
  to: string
  type: 'command' | 'response' | 'error' | 'notification' | 'query'
  data: unknown
  timestamp: Date
  requiresResponse: boolean
  correlationId?: string
  priority?: 'low' | 'normal' | 'high' | 'urgent'
}

export interface MCPProtocol {
  version: string
  capabilities: string[]
  metadata?: Record<string, unknown>
}

export interface MCPConnection {
  id: string
  agentId: string
  status: 'connected' | 'disconnected' | 'error'
  lastPing?: Date
  latency?: number
}

export interface MCPRouter {
  routes: Map<string, string[]>
  handlers: Map<string, MCPMessageHandler>
}

export type MCPMessageHandler = (message: MCPMessage) => Promise<MCPMessage | void>