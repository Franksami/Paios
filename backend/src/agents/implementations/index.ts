import { BusinessIntelligenceAgent } from './business-intelligence'
import { SystemArchitectureAgent } from './system-architecture'
import { MCPAgent } from '../base/mcp-agent'
import { AGENT_NUMBERS } from '@paios/shared'

// Agent registry mapping agent numbers to implementations
export const agentImplementations: Record<number, typeof MCPAgent> = {
  [AGENT_NUMBERS.BUSINESS_INTELLIGENCE]: BusinessIntelligenceAgent,
  [AGENT_NUMBERS.SYSTEM_ARCHITECTURE]: SystemArchitectureAgent,
  // Future agents will be added here:
  // [AGENT_NUMBERS.WEB_SCRAPING]: WebScrapingAgent,
  // [AGENT_NUMBERS.SOCIAL_MEDIA]: SocialMediaAgent,
  // etc.
}

// Factory function to create agent instances
export function createAgent(agentNumber: number): MCPAgent | null {
  const AgentClass = agentImplementations[agentNumber]
  
  if (!AgentClass) {
    return null
  }
  
  return new AgentClass()
}

// Export all agent implementations
export { BusinessIntelligenceAgent, SystemArchitectureAgent }