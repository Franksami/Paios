# Personal AI Operating System - Cursor Rules

## Project Overview
This is a self-modifying AI agent system with voice control and real-time architecture visualization. The system appears as a minimalist portfolio website but functions as a unified AI workspace where each numbered accordion item connects to specialized AI agents.

## Core Philosophy
- **Teaching through interaction**: Users learn system architecture concepts naturally while using the system
- **Progressive disclosure**: Complex functionality hidden behind simple numbered interfaces  
- **Self-documenting**: The system explains how it works as it operates
- **Voice-first**: Every agent should be controllable through natural language
- **Real-time transparency**: Users can see and modify how agents communicate

## Code Standards

### TypeScript
- Use TypeScript for ALL new code (frontend, backend, shared)
- Prefer interfaces over types for object definitions
- Use strict mode and enable all strict type checking
- Export types from shared package for cross-platform consistency
- Use meaningful generic type parameters (not just T, U, V)

```typescript
// Good
interface AgentConfiguration<TParams = Record<string, unknown>> {
  agentNumber: number;
  name: string;
  parameters: TParams;
}

// Avoid
type AgentConfig = {
  num: number;
  n: string;
  params: any;
}
```

### Code Organization
- **Functional programming patterns** where possible
- **Pure functions** for business logic
- **Immutable data structures** for state management
- **Dependency injection** for services
- **Factory patterns** for agent creation

### Error Handling
- Use Result/Either patterns for operations that can fail
- Comprehensive error context with user-friendly messages
- Graceful degradation when services are unavailable
- Never throw unhandled exceptions in production code

```typescript
// Good
interface Result<T, E = Error> {
  success: boolean;
  data?: T;
  error?: E;
}

async function executeAgent(command: AgentCommand): Promise<Result<AgentResponse>> {
  try {
    const result = await agent.execute(command);
    return { success: true, data: result };
  } catch (error) {
    return { 
      success: false, 
      error: new AgentExecutionError(
        `Agent execution failed: ${error.message}`,
        { command, originalError: error }
      )
    };
  }
}
```

### Naming Conventions
- **Variables**: camelCase with descriptive names
- **Functions**: camelCase verbs (executeCommand, processVoiceInput)
- **Classes**: PascalCase nouns (BusinessIntelligenceAgent)
- **Interfaces**: PascalCase with descriptive suffixes (AgentConfiguration, VoiceCommand)
- **Files**: kebab-case matching primary export
- **Directories**: kebab-case representing feature areas

## Architecture Principles

### Agent Development
- **Base class inheritance**: All agents extend MCPAgent base class
- **Hot-swappable modules**: Agents can be updated without system restart
- **Configuration-driven**: Agent behavior controlled by external config
- **Stateless operations**: Agents don't maintain internal state between calls
- **Context awareness**: Agents can access user context and cross-agent data

```typescript
// Agent implementation pattern
export class BusinessIntelligenceAgent extends MCPAgent {
  agentNumber = 1;
  name = "Business Intelligence";
  description = "Revenue tracking and financial analytics";

  async execute(command: AgentCommand): Promise<AgentResponse> {
    // Implementation follows standard pattern
  }

  async processVoiceCommand(text: string): Promise<string> {
    // Voice processing implementation
  }
}
```

### Voice Interface
- **Natural language first**: Commands should work as users naturally speak
- **Context awareness**: Voice commands inherit context from active agent
- **Fallback handling**: Text input when voice unavailable
- **Multi-language support**: Voice commands work in multiple languages
- **Command routing**: Global commands route to appropriate agents automatically

### Real-time Architecture
- **WebSocket for all live updates**: No polling for real-time data
- **Event-driven communication**: Agents communicate through events
- **Optimistic UI updates**: UI updates immediately, sync with server
- **Graceful offline handling**: System works offline with sync on reconnect

### Security
- **Zero-trust architecture**: Verify all requests and communications
- **Biometric for sensitive operations**: Credential access requires biometric auth
- **Encrypted storage**: All sensitive data encrypted at rest
- **Audit trails**: All system modifications logged
- **Rate limiting**: Prevent abuse while maintaining usability

## Development Patterns

### Frontend (Next.js + React)

#### Component Structure
```typescript
// Prefer functional components with hooks
interface AgentCardProps {
  agent: Agent;
  isActive: boolean;
  onActivate: (agentId: string) => void;
}

export function AgentCard({ agent, isActive, onActivate }: AgentCardProps) {
  // Component implementation
}
```

#### State Management
- **Zustand stores** for complex state
- **React Query** for server state
- **Local state** for UI-only state
- **Context** for deeply nested props

#### Styling
- **Tailwind CSS** for all styling
- **Mobile-first responsive** design
- **Dark mode support** through CSS variables
- **Smooth animations** using Framer Motion

### Backend (Node.js + Express)

#### API Design
- **RESTful endpoints** for CRUD operations
- **WebSocket events** for real-time updates
- **MCP protocol** for agent communication
- **Consistent response format** across all endpoints

```typescript
// Standard API response format
interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  metadata?: {
    timestamp: string;
    requestId: string;
    executionTime: number;
  };
}
```

#### Database
- **PostgreSQL** for relational data
- **Redis** for caching and real-time state
- **Migrations** for all schema changes
- **Indexing** for performance optimization

#### Agent Implementation
- **Factory pattern** for agent creation
- **Dependency injection** for external services
- **Config validation** using JSON schema
- **Memory management** for long-running processes

## Testing Requirements

### Unit Tests
- **100% coverage** for business logic
- **Agent execution tests** for all agents
- **Voice command parsing** tests
- **Error scenario coverage**

### Integration Tests
- **Cross-agent communication** workflows
- **Database operations** with test data
- **External API integration** with mocks
- **WebSocket event flows**

### End-to-End Tests
- **Complete user workflows** from voice to execution
- **System modification** scenarios
- **Performance under load**
- **Mobile device compatibility**

## Agent Development Guidelines

### New Agent Checklist
- [ ] Extends MCPAgent base class
- [ ] Implements voice command processing
- [ ] Includes configuration schema
- [ ] Has comprehensive error handling
- [ ] Supports hot-swapping
- [ ] Includes unit and integration tests
- [ ] Documents voice commands
- [ ] Follows security best practices

### Voice Command Design
- Commands should be **natural and conversational**
- Support **multiple phrasings** for same action
- Include **context-aware shortcuts**
- Provide **voice feedback** for confirmations
- Handle **ambiguity** gracefully with clarifying questions

### Cross-Agent Communication
- Use **MCP protocol** for all agent-to-agent communication
- **Event-driven** rather than direct calls
- **Async message passing** with delivery confirmation
- **Workflow orchestration** through system rules agent

## Performance Optimization

### Frontend Performance
- **Code splitting** by agent functionality
- **Lazy loading** for agent components
- **Memoization** for expensive calculations
- **Virtual scrolling** for large lists
- **Service worker** for offline functionality

### Backend Performance
- **Connection pooling** for database
- **Redis caching** for frequent queries
- **Background jobs** for long-running tasks
- **Rate limiting** to prevent abuse
- **Monitoring** for performance bottlenecks

### Real-time Performance
- **WebSocket connection management**
- **Message queuing** for offline users
- **Efficient data serialization**
- **Batched updates** to reduce traffic

## Security Guidelines

### Authentication & Authorization
- **JWT tokens** with short expiration
- **Refresh token rotation**
- **Biometric authentication** for sensitive operations
- **Role-based access control** for different user types

### Data Protection
- **AES-256 encryption** for sensitive data
- **Secure key management** with rotation
- **Input validation** on all endpoints
- **SQL injection prevention**
- **XSS protection**

### API Security
- **Rate limiting** per user and IP
- **Request signing** for critical operations
- **CORS protection** with specific origins
- **Audit logging** for all API calls

## Monitoring & Observability

### Application Monitoring
- **Performance metrics** for all agents
- **Error tracking** with context
- **User behavior analytics**
- **System health monitoring**

### Logging
- **Structured logging** with correlation IDs
- **Log levels** appropriate to environment
- **Sensitive data** never logged
- **Distributed tracing** for cross-service calls

## Development Workflow

### Git Workflow
- **Feature branches** for all development
- **Conventional commits** for clear history
- **Pull request reviews** required
- **Automated testing** on all commits

### Code Review Checklist
- [ ] Code follows style guidelines
- [ ] Tests cover new functionality
- [ ] Security considerations addressed
- [ ] Performance impact assessed
- [ ] Documentation updated
- [ ] Error handling comprehensive
- [ ] Voice commands tested
- [ ] Mobile compatibility verified

### Release Process
- **Semantic versioning** for releases
- **Database migrations** tested
- **Agent hot-swap compatibility** verified
- **Performance regression testing**
- **Security scan** before deployment

## Common Patterns

### Error Boundaries
```typescript
// Wrap agent components in error boundaries
<AgentErrorBoundary agentNumber={1}>
  <BusinessIntelligenceAgent />
</AgentErrorBoundary>
```

### Voice Command Registration
```typescript
// Register voice commands in agent constructor
this.voiceCommands = [
  {
    patterns: ["show revenue", "display income", "financial status"],
    action: "get_revenue",
    description: "Display current revenue and financial metrics"
  }
];
```

### Configuration Validation
```typescript
// Use JSON schema for agent configuration
const configSchema = {
  type: "object",
  properties: {
    apiKey: { type: "string", minLength: 10 },
    refreshInterval: { type: "number", minimum: 60 }
  },
  required: ["apiKey"]
};
```

### Cross-Agent Messaging
```typescript
// Send messages through MCP protocol
await this.sendMessage("research_agent", {
  type: "query_request",
  data: { topic: "AI agent trends", format: "summary" }
});
```

## Troubleshooting Guidelines

### Common Issues
- **Voice recognition failures**: Check microphone permissions and fallback to text
- **Agent execution timeouts**: Implement proper timeout handling and user feedback
- **WebSocket disconnections**: Automatic reconnection with exponential backoff
- **Performance degradation**: Monitor resource usage and implement caching

### Debugging Tools
- **Browser dev tools** for frontend debugging
- **Agent execution logs** for backend issues
- **Performance profiler** for optimization
- **Network monitor** for real-time issues

Remember: This system should feel magical to use while teaching users fundamental concepts about system architecture, dependencies, and automation. Every interaction should be delightful while building understanding of how complex systems work together.