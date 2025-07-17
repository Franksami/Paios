# PAIOS Agent Development Guide

This directory contains specifications, configurations, and templates for developing AI agents in the Personal AI Operating System.

## Directory Structure

- **specifications/**: Individual agent specification documents
- **configurations/**: Agent configuration files and voice command mappings
- **examples/**: Example agent implementations
- **agent-template/**: Template for creating new agents

## Creating a New Agent

1. **Use the generator tool**:
   ```bash
   npm run tools:generate-agent -- --number 34 --name "My New Agent"
   ```

2. **Manual creation**:
   - Copy the `agent-template/` directory
   - Update the agent number and name
   - Implement the required methods
   - Add voice commands
   - Write tests

## Agent Base Class

All agents must extend the `MCPAgent` base class and implement:

```typescript
export abstract class MCPAgent {
  abstract agentNumber: number
  abstract name: string
  abstract description: string
  
  abstract initialize(config: AgentConfig): Promise<void>
  abstract execute(command: AgentCommand): Promise<AgentResponse>
  abstract cleanup(): Promise<void>
  
  // Optional but recommended
  async processVoiceCommand(text: string): Promise<string> {
    // Voice command processing
  }
}
```

## Voice Command Registration

Agents should register their voice commands in the constructor:

```typescript
this.voiceCommands = [
  {
    patterns: ["show revenue", "display income"],
    action: "get_revenue",
    description: "Display current revenue"
  }
]
```

## Configuration Schema

Each agent should define its configuration schema:

```json
{
  "type": "object",
  "properties": {
    "apiKey": {
      "type": "string",
      "description": "API key for external service"
    },
    "refreshInterval": {
      "type": "number",
      "minimum": 60,
      "description": "Data refresh interval in seconds"
    }
  },
  "required": ["apiKey"]
}
```

## Testing

Write comprehensive tests for your agent:

```typescript
describe('MyAgent', () => {
  it('should execute commands', async () => {
    const agent = new MyAgent()
    await agent.initialize(config)
    
    const response = await agent.execute({
      action: 'test',
      parameters: {},
      userId: 'test-user',
      requestId: 'test-123',
      timestamp: new Date()
    })
    
    expect(response.success).toBe(true)
  })
})
```

## Best Practices

1. **Error Handling**: Always use Result types for operations that can fail
2. **Voice Commands**: Support multiple natural phrasings
3. **Configuration**: Validate all configuration on initialization
4. **Memory Management**: Clean up resources in the cleanup() method
5. **Security**: Never log sensitive data like API keys
6. **Performance**: Cache responses when appropriate
7. **Documentation**: Document all voice commands and capabilities