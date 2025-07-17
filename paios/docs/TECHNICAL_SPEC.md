# Technical Specification - Personal AI Operating System

## System Architecture Overview

### High-Level Architecture

```mermaid
graph TB
    UI[Minimalist UI Layer] --> VR[Voice Router]
    UI --> AR[Agent Registry]
    VR --> AR
    AR --> HS[Hot-Swap Engine]
    AR --> MCP[MCP Communication Layer]
    MCP --> A1[Agent #1: Business Intelligence]
    MCP --> A7[Agent #7: Web Scraping]
    MCP --> A8[Agent #8: Social Media]
    MCP --> A15[Agent #15: Invoicing]
    MCP --> A18[Agent #18: Research]
    MCP --> A29[Agent #29: Publishing]
    MCP --> A31[Agent #31: System Architecture]
    MCP --> A32[Agent #32: Password Vault]
    A31 --> SV[System Visualizer]
    A32 --> SEC[Security Layer]
    MCP --> DB[(PostgreSQL)]
    MCP --> REDIS[(Redis Cache)]
    MCP --> EXT[External APIs]
```

### Technology Stack

**Frontend**
- **Framework**: Next.js 14+ with TypeScript
- **Styling**: Tailwind CSS with custom animations
- **State Management**: Zustand for UI state, React Query for server state
- **Voice Processing**: Web Speech API + Whisper API for transcription
- **Real-time**: Socket.io client for live updates
- **PWA**: Service workers for offline functionality
- **Animation**: Framer Motion for smooth transitions

**Backend**
- **Runtime**: Node.js 20+ with TypeScript
- **Framework**: Express.js with Socket.io for real-time communication
- **Agent Orchestration**: Custom MCP implementation with LangGraph
- **Database**: PostgreSQL 15+ for persistent data
- **Cache**: Redis 7+ for session state and API caching
- **Queue**: Bull/BullMQ for background job processing
- **Security**: Argon2 for password hashing, AES-256 for encryption

**Infrastructure**
- **Hosting**: Vercel for frontend, Railway/Render for backend
- **Database**: Supabase or PlanetScale for managed PostgreSQL
- **Cache**: Upstash Redis for managed Redis
- **CDN**: Cloudflare for global performance
- **Monitoring**: Sentry for error tracking, Vercel Analytics
- **Voice**: OpenAI Whisper API, ElevenLabs for TTS

**External Integrations**
- **MCP Protocol**: Custom implementation for agent communication
- **APIs**: Stripe, Apify, social media platforms, productivity tools
- **AI**: OpenAI GPT-4, Claude 3.5 Sonnet for agent intelligence
- **Auth**: NextAuth.js with biometric support where available

## Database Schema

### Core Tables

```sql
-- Users and authentication
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Agent configurations
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  agent_number INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  config JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Agent interactions and workflows
CREATE TABLE agent_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  source_agent_id UUID REFERENCES agents(id),
  target_agent_id UUID REFERENCES agents(id),
  trigger_conditions JSONB DEFAULT '{}',
  actions JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Voice commands and interactions
CREATE TABLE voice_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  agent_id UUID REFERENCES agents(id),
  command_text TEXT NOT NULL,
  response_text TEXT,
  execution_status VARCHAR(50) DEFAULT 'pending',
  execution_time_ms INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Encrypted credential storage
CREATE TABLE credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  service_name VARCHAR(255) NOT NULL,
  encrypted_data TEXT NOT NULL,
  encryption_key_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- System modifications and version control
CREATE TABLE system_modifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  modification_type VARCHAR(100) NOT NULL,
  before_state JSONB,
  after_state JSONB,
  applied_at TIMESTAMP DEFAULT NOW(),
  rollback_available BOOLEAN DEFAULT true
);

-- Agent memory and context
CREATE TABLE agent_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id),
  memory_type VARCHAR(100) NOT NULL,
  content JSONB NOT NULL,
  relevance_score FLOAT DEFAULT 1.0,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## API Architecture

### RESTful Endpoints

```typescript
// Agent management
GET    /api/agents                    // List all user agents
POST   /api/agents                    // Create new agent
GET    /api/agents/:id                // Get agent details
PUT    /api/agents/:id                // Update agent config
DELETE /api/agents/:id                // Delete agent

// Agent execution
POST   /api/agents/:id/execute        // Execute agent command
GET    /api/agents/:id/status         // Get execution status
POST   /api/agents/:id/voice          // Voice command input

// Workflow management
GET    /api/workflows                 // List workflows
POST   /api/workflows                 // Create workflow
PUT    /api/workflows/:id             // Update workflow
DELETE /api/workflows/:id             // Delete workflow

// System architecture
GET    /api/system/architecture       // Get system diagram data
POST   /api/system/modify             // Modify system configuration
GET    /api/system/health             // System health check
POST   /api/system/rollback           // Rollback recent changes

// Credentials management
GET    /api/credentials               // List stored credentials
POST   /api/credentials               // Store new credential
PUT    /api/credentials/:id           // Update credential
DELETE /api/credentials/:id           // Delete credential

// Voice processing
POST   /api/voice/process             // Process voice input
GET    /api/voice/commands            // Get command history
POST   /api/voice/settings            // Update voice settings
```

### WebSocket Events

```typescript
// Real-time agent communication
interface SocketEvents {
  // Agent status updates
  'agent:status': (agentId: string, status: AgentStatus) => void;
  'agent:response': (agentId: string, response: any) => void;
  'agent:error': (agentId: string, error: string) => void;
  
  // System architecture updates
  'system:workflow_updated': (workflow: WorkflowDefinition) => void;
  'system:agent_added': (agent: AgentConfig) => void;
  'system:performance_update': (metrics: PerformanceMetrics) => void;
  
  // Voice processing
  'voice:command_received': (command: string) => void;
  'voice:processing': (status: string) => void;
  'voice:response': (response: string) => void;
  
  // Cross-agent communication
  'agent:message': (from: string, to: string, data: any) => void;
  'workflow:triggered': (workflowId: string, data: any) => void;
}
```

## MCP Agent Framework

### Agent Base Class

```typescript
abstract class MCPAgent {
  abstract agentNumber: number;
  abstract name: string;
  abstract description: string;
  
  // Core agent lifecycle
  abstract initialize(config: AgentConfig): Promise<void>;
  abstract execute(command: AgentCommand): Promise<AgentResponse>;
  abstract cleanup(): Promise<void>;
  
  // Voice interface
  async processVoiceCommand(text: string): Promise<string> {
    const command = await this.parseVoiceCommand(text);
    const response = await this.execute(command);
    return this.formatVoiceResponse(response);
  }
  
  // Cross-agent communication
  async sendMessage(targetAgent: string, data: any): Promise<void> {
    await this.mcpClient.sendMessage(targetAgent, {
      from: this.name,
      data,
      timestamp: new Date().toISOString()
    });
  }
  
  // Configuration management
  async updateConfig(newConfig: Partial<AgentConfig>): Promise<void> {
    this.config = { ...this.config, ...newConfig };
    await this.saveConfig();
    await this.restart();
  }
  
  // Memory and context
  async saveMemory(type: string, content: any, ttl?: number): Promise<void> {
    await this.memoryStore.save(this.agentNumber, type, content, ttl);
  }
  
  async getMemory(type: string): Promise<any[]> {
    return await this.memoryStore.retrieve(this.agentNumber, type);
  }
}
```

### Agent Communication Protocol

```typescript
interface MCPMessage {
  id: string;
  from: string;
  to: string;
  type: 'command' | 'response' | 'error' | 'notification';
  data: any;
  timestamp: string;
  requiresResponse: boolean;
}

interface AgentCommand {
  action: string;
  parameters: Record<string, any>;
  context?: Record<string, any>;
  userId: string;
  requestId: string;
}

interface AgentResponse {
  success: boolean;
  data?: any;
  error?: string;
  metadata?: {
    executionTime: number;
    resourcesUsed: string[];
    nextSuggestedActions?: string[];
  };
}
```

## Frontend Architecture

### Component Structure

```
src/
├── components/
│   ├── ui/                     # Reusable UI components
│   │   ├── accordion.tsx
│   │   ├── voice-button.tsx
│   │   └── system-diagram.tsx
│   ├── agents/                 # Agent-specific components
│   │   ├── agent-card.tsx
│   │   ├── agent-interface.tsx
│   │   └── voice-interface.tsx
│   └── system/                 # System management components
│       ├── architecture-viewer.tsx
│       ├── workflow-editor.tsx
│       └── performance-monitor.tsx
├── hooks/                      # Custom React hooks
│   ├── use-voice.ts
│   ├── use-agents.ts
│   └── use-websocket.ts
├── stores/                     # Zustand stores
│   ├── agent-store.ts
│   ├── voice-store.ts
│   └── system-store.ts
├── lib/                        # Utility functions
│   ├── mcp-client.ts
│   ├── voice-processor.ts
│   └── encryption.ts
└── types/                      # TypeScript definitions
    ├── agents.ts
    ├── mcp.ts
    └── system.ts
```

### State Management

```typescript
// Agent store for managing agent states
interface AgentStore {
  agents: Record<number, AgentState>;
  activeAgent: number | null;
  
  // Actions
  setActiveAgent: (agentNumber: number) => void;
  updateAgentStatus: (agentNumber: number, status: AgentStatus) => void;
  executeCommand: (agentNumber: number, command: string) => Promise<void>;
  
  // Voice integration
  processVoiceCommand: (command: string) => Promise<void>;
  getVoiceCapableAgents: () => number[];
}

// System store for architecture management
interface SystemStore {
  workflows: WorkflowDefinition[];
  systemHealth: SystemHealth;
  performanceMetrics: PerformanceMetrics;
  
  // Actions
  addWorkflow: (workflow: WorkflowDefinition) => void;
  removeWorkflow: (workflowId: string) => void;
  modifySystem: (modification: SystemModification) => Promise<void>;
  rollbackSystem: (toTimestamp: string) => Promise<void>;
}
```

## Security Architecture

### Encryption and Data Protection

```typescript
// Credential encryption using AES-256
class CredentialManager {
  private async encryptCredential(
    data: any, 
    userMasterKey: string
  ): Promise<EncryptedData> {
    const key = await this.deriveKey(userMasterKey);
    const encrypted = await encrypt(JSON.stringify(data), key);
    return {
      data: encrypted,
      keyId: await this.hashKey(key),
      algorithm: 'AES-256-GCM'
    };
  }
  
  private async decryptCredential(
    encryptedData: EncryptedData,
    userMasterKey: string
  ): Promise<any> {
    const key = await this.deriveKey(userMasterKey);
    const decrypted = await decrypt(encryptedData.data, key);
    return JSON.parse(decrypted);
  }
}

// Biometric authentication integration
class BiometricAuth {
  async authenticate(): Promise<boolean> {
    if ('PublicKeyCredential' in window) {
      try {
        const credential = await navigator.credentials.get({
          publicKey: this.getPublicKeyOptions()
        });
        return this.verifyCredential(credential);
      } catch (error) {
        console.error('Biometric auth failed:', error);
        return false;
      }
    }
    return false;
  }
}
```

### API Security

```typescript
// Rate limiting and authentication middleware
app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  message: 'Too many requests from this IP'
}));

// JWT token validation
app.use('/api', authenticateToken);

function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.sendStatus(401);
  }
  
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}
```

## Performance Optimization

### Caching Strategy

```typescript
// Redis caching for agent responses
class CacheManager {
  async cacheAgentResponse(
    agentId: string, 
    command: string, 
    response: any,
    ttl: number = 300
  ): Promise<void> {
    const key = `agent:${agentId}:${this.hashCommand(command)}`;
    await this.redis.setex(key, ttl, JSON.stringify(response));
  }
  
  async getCachedResponse(
    agentId: string, 
    command: string
  ): Promise<any | null> {
    const key = `agent:${agentId}:${this.hashCommand(command)}`;
    const cached = await this.redis.get(key);
    return cached ? JSON.parse(cached) : null;
  }
}

// Database query optimization
class QueryOptimizer {
  // Use database indexing for frequent queries
  static readonly INDEXES = [
    'CREATE INDEX idx_agents_user_id ON agents(user_id)',
    'CREATE INDEX idx_voice_interactions_user_agent ON voice_interactions(user_id, agent_id)',
    'CREATE INDEX idx_agent_memory_type ON agent_memory(agent_id, memory_type)',
    'CREATE INDEX idx_workflows_user_id ON agent_workflows(user_id)'
  ];
}
```

### Real-time Performance

```typescript
// WebSocket connection management
class WebSocketManager {
  private connections = new Map<string, WebSocket>();
  
  broadcast(event: string, data: any, excludeUser?: string): void {
    for (const [userId, ws] of this.connections) {
      if (userId !== excludeUser && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ event, data }));
      }
    }
  }
  
  // Efficient message queuing for offline users
  async queueMessage(userId: string, message: any): Promise<void> {
    await this.redis.lpush(`queue:${userId}`, JSON.stringify(message));
    await this.redis.expire(`queue:${userId}`, 86400); // 24 hours
  }
}
```

## Deployment Architecture

### Production Infrastructure

```yaml
# docker-compose.yml for local development
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:3001
      
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=postgresql://user:pass@postgres:5432/paios
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis
      
  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=paios
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data
      
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
```

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production
on:
  push:
    branches: [main]
    
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test
      - run: npm run type-check
      
  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          
  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: superfly/flyctl-actions/setup-flyctl@master
      - run: flyctl deploy --remote-only
```

## Monitoring and Observability

### Application Monitoring

```typescript
// Performance monitoring
class PerformanceMonitor {
  static trackAgentExecution(agentId: string, startTime: number): void {
    const duration = Date.now() - startTime;
    
    // Log to analytics
    this.analytics.track('agent_execution', {
      agentId,
      duration,
      timestamp: new Date().toISOString()
    });
    
    // Alert if execution time is too high
    if (duration > 10000) { // 10 seconds
      this.alertManager.sendAlert('slow_agent_execution', {
        agentId,
        duration
      });
    }
  }
}

// Error tracking with Sentry
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

## Testing Strategy

### Unit Testing

```typescript
// Agent testing framework
describe('Agent #1: Business Intelligence', () => {
  let agent: BusinessIntelligenceAgent;
  
  beforeEach(() => {
    agent = new BusinessIntelligenceAgent();
    agent.initialize(mockConfig);
  });
  
  it('should fetch revenue data from Stripe', async () => {
    const command = { action: 'get_revenue', parameters: {} };
    const response = await agent.execute(command);
    
    expect(response.success).toBe(true);
    expect(response.data.revenue).toBeGreaterThan(0);
  });
  
  it('should process voice commands correctly', async () => {
    const voiceCommand = "Show me this month's revenue";
    const response = await agent.processVoiceCommand(voiceCommand);
    
    expect(response).toContain('revenue');
  });
});
```

### Integration Testing

```typescript
// Cross-agent workflow testing
describe('Agent Workflows', () => {
  it('should trigger invoice generation from business intelligence', async () => {
    const biAgent = new BusinessIntelligenceAgent();
    const invoiceAgent = new InvoiceAgent();
    
    // Simulate milestone completion
    await biAgent.execute({ 
      action: 'mark_milestone_complete', 
      parameters: { projectId: 'test-project' } 
    });
    
    // Verify invoice agent received trigger
    const invoices = await invoiceAgent.getPendingInvoices();
    expect(invoices).toHaveLength(1);
  });
});
```