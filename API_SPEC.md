# API Specification - Personal AI Operating System

## Overview
This document defines the complete API specification for the Personal AI Operating System (PAIOS), including REST endpoints, WebSocket events, MCP protocol definitions, and authentication mechanisms.

## Base Configuration

**Base URLs:**
- Development: `http://localhost:3001/api`
- Production: `https://api.paios.dev/api`

**API Version:** `v1`

**Content Type:** `application/json`

**Authentication:** Bearer token (JWT) + Biometric for sensitive operations

## Authentication

### JWT Token Authentication

```typescript
interface AuthToken {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: "Bearer";
  user_id: string;
}

interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  preferences: UserPreferences;
}

interface UserPreferences {
  voice_enabled: boolean;
  default_voice_language: string;
  biometric_enabled: boolean;
  theme: "light" | "dark" | "system";
  notification_settings: NotificationSettings;
}
```

### Authentication Endpoints

```http
POST /auth/login
POST /auth/logout
POST /auth/refresh
POST /auth/biometric/setup
POST /auth/biometric/verify
GET  /auth/me
PUT  /auth/preferences
```

#### POST /auth/login
```typescript
// Request
interface LoginRequest {
  email: string;
  password?: string;
  biometric_credential?: BiometricCredential;
}

// Response
interface LoginResponse {
  success: boolean;
  data: AuthToken & { user: User };
  message: string;
}
```

#### POST /auth/biometric/setup
```typescript
// Request
interface BiometricSetupRequest {
  public_key: string;
  challenge_response: string;
  authenticator_data: string;
}

// Response
interface BiometricSetupResponse {
  success: boolean;
  credential_id: string;
  backup_codes: string[];
}
```

## Agent Management API

### Agent Endpoints

```http
GET    /agents                    # List all user agents
POST   /agents                    # Create new agent
GET    /agents/:id                # Get agent details
PUT    /agents/:id                # Update agent configuration
DELETE /agents/:id                # Delete agent
POST   /agents/:id/execute        # Execute agent command
GET    /agents/:id/status         # Get execution status
POST   /agents/:id/voice          # Process voice command
GET    /agents/:id/memory         # Get agent memory
POST   /agents/:id/memory         # Store agent memory
GET    /agents/:id/logs           # Get agent execution logs
```

### Agent Data Models

```typescript
interface Agent {
  id: string;
  user_id: string;
  agent_number: number;
  name: string;
  description: string;
  config: AgentConfig;
  status: AgentStatus;
  is_active: boolean;
  voice_enabled: boolean;
  created_at: string;
  updated_at: string;
  last_execution: string | null;
  execution_count: number;
  average_execution_time: number;
}

interface AgentConfig {
  api_keys: Record<string, string>;
  preferences: Record<string, any>;
  workflow_triggers: WorkflowTrigger[];
  voice_commands: VoiceCommand[];
  external_integrations: ExternalIntegration[];
}

interface AgentStatus {
  state: "idle" | "executing" | "error" | "disabled";
  last_error: string | null;
  health_score: number;
  resource_usage: ResourceUsage;
}

interface ResourceUsage {
  cpu_usage: number;
  memory_usage: number;
  api_calls_per_minute: number;
  network_usage: number;
}

interface AgentCommand {
  action: string;
  parameters: Record<string, any>;
  context?: Record<string, any>;
  user_id: string;
  request_id: string;
  voice_input?: boolean;
  priority: "low" | "normal" | "high";
}

interface AgentResponse {
  success: boolean;
  data?: any;
  error?: string;
  metadata: {
    execution_time: number;
    resources_used: string[];
    next_suggested_actions?: string[];
    workflow_triggered?: string[];
  };
}
```

### Agent API Examples

#### GET /agents
```typescript
// Response
interface AgentsListResponse {
  success: boolean;
  data: {
    agents: Agent[];
    total_count: number;
    active_count: number;
  };
}
```

#### POST /agents/:id/execute
```typescript
// Request
interface ExecuteAgentRequest {
  command: AgentCommand;
  wait_for_completion?: boolean;
  timeout_ms?: number;
}

// Response
interface ExecuteAgentResponse {
  success: boolean;
  data: {
    execution_id: string;
    result?: AgentResponse;
    status: "queued" | "executing" | "completed" | "failed";
  };
}
```

#### POST /agents/:id/voice
```typescript
// Request
interface VoiceCommandRequest {
  audio_data?: string; // Base64 encoded audio
  text_input?: string; // Text fallback
  language?: string;
  context?: Record<string, any>;
}

// Response
interface VoiceCommandResponse {
  success: boolean;
  data: {
    transcribed_text: string;
    command_understood: boolean;
    agent_response: AgentResponse;
    voice_response?: string; // Text-to-speech response
  };
}
```

## Workflow Management API

### Workflow Endpoints

```http
GET    /workflows                 # List workflows
POST   /workflows                 # Create workflow
GET    /workflows/:id             # Get workflow details
PUT    /workflows/:id             # Update workflow
DELETE /workflows/:id             # Delete workflow
POST   /workflows/:id/execute     # Execute workflow
GET    /workflows/:id/history     # Get execution history
POST   /workflows/validate        # Validate workflow definition
```

### Workflow Data Models

```typescript
interface Workflow {
  id: string;
  user_id: string;
  name: string;
  description: string;
  definition: WorkflowDefinition;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_executed: string | null;
  execution_count: number;
  success_rate: number;
}

interface WorkflowDefinition {
  trigger: WorkflowTrigger;
  steps: WorkflowStep[];
  error_handling: ErrorHandling;
  timeout_ms: number;
  retry_policy: RetryPolicy;
}

interface WorkflowTrigger {
  type: "voice_command" | "agent_completion" | "schedule" | "webhook" | "manual";
  conditions: Record<string, any>;
  source_agent?: number;
}

interface WorkflowStep {
  id: string;
  agent_number: number;
  action: string;
  parameters: Record<string, any>;
  depends_on?: string[]; // Step IDs
  condition?: string; // JavaScript expression
  timeout_ms?: number;
}

interface ErrorHandling {
  strategy: "fail_fast" | "continue" | "retry" | "fallback";
  fallback_steps?: WorkflowStep[];
  notification_on_error: boolean;
}

interface RetryPolicy {
  max_attempts: number;
  backoff_strategy: "linear" | "exponential" | "fixed";
  delay_ms: number;
}
```

## System Management API

### System Endpoints

```http
GET    /system/health             # System health check
GET    /system/architecture       # Get system diagram data
POST   /system/modify             # Modify system configuration
POST   /system/rollback           # Rollback recent changes
GET    /system/performance        # Performance metrics
GET    /system/logs               # System logs
PUT    /system/config             # Update system configuration
GET    /system/modifications      # Get modification history
```

### System Data Models

```typescript
interface SystemHealth {
  status: "healthy" | "degraded" | "unhealthy";
  uptime: number;
  version: string;
  agents: {
    total: number;
    active: number;
    error: number;
  };
  resources: {
    cpu_usage: number;
    memory_usage: number;
    disk_usage: number;
    network_latency: number;
  };
  external_services: ExternalServiceStatus[];
}

interface ExternalServiceStatus {
  name: string;
  status: "online" | "offline" | "degraded";
  response_time: number;
  last_check: string;
}

interface SystemArchitecture {
  agents: ArchitectureNode[];
  connections: ArchitectureConnection[];
  workflows: ArchitectureWorkflow[];
  mermaid_diagram: string;
}

interface ArchitectureNode {
  id: string;
  agent_number: number;
  name: string;
  type: "agent" | "service" | "external_api";
  status: "active" | "inactive" | "error";
  position: { x: number; y: number };
  metadata: Record<string, any>;
}

interface ArchitectureConnection {
  id: string;
  source: string;
  target: string;
  type: "data_flow" | "trigger" | "dependency";
  status: "active" | "inactive";
  metadata: {
    frequency?: number;
    last_used?: string;
    data_volume?: number;
  };
}

interface SystemModification {
  id: string;
  type: "agent_config" | "workflow_change" | "system_setting" | "architecture_change";
  description: string;
  before_state: Record<string, any>;
  after_state: Record<string, any>;
  applied_by: string;
  applied_at: string;
  rollback_available: boolean;
  impact_assessment: string;
}
```

## Voice Processing API

### Voice Endpoints

```http
POST   /voice/process             # Process voice input
GET    /voice/commands            # Get command history
POST   /voice/settings            # Update voice settings
GET    /voice/capabilities        # Get voice capabilities
POST   /voice/synthesize          # Text-to-speech
POST   /voice/train               # Train voice model
```

### Voice Data Models

```typescript
interface VoiceProcessingRequest {
  audio_data?: string; // Base64 encoded
  text_fallback?: string;
  language: string;
  context?: {
    active_agent?: number;
    conversation_history?: string[];
    user_preferences?: Record<string, any>;
  };
}

interface VoiceProcessingResponse {
  success: boolean;
  data: {
    transcribed_text: string;
    confidence_score: number;
    detected_language: string;
    intent: VoiceIntent;
    agent_routing: AgentRouting;
    response: VoiceResponse;
  };
}

interface VoiceIntent {
  action: string;
  entities: Record<string, any>;
  confidence: number;
  alternative_intents?: VoiceIntent[];
}

interface AgentRouting {
  target_agent: number | null;
  routing_confidence: number;
  fallback_agents: number[];
  global_command: boolean;
}

interface VoiceResponse {
  text: string;
  audio_url?: string;
  suggestions?: string[];
  requires_followup: boolean;
}

interface VoiceSettings {
  language: string;
  voice_id: string;
  speech_rate: number;
  pitch: number;
  volume: number;
  wake_word_enabled: boolean;
  wake_words: string[];
  noise_suppression: boolean;
  auto_transcription: boolean;
}
```

## Credential Management API

### Credential Endpoints

```http
GET    /credentials               # List stored credentials
POST   /credentials               # Store new credential
GET    /credentials/:id           # Get credential (requires biometric)
PUT    /credentials/:id           # Update credential
DELETE /credentials/:id           # Delete credential
POST   /credentials/verify        # Verify credential access
POST   /credentials/backup        # Generate backup codes
```

### Credential Data Models

```typescript
interface Credential {
  id: string;
  user_id: string;
  service_name: string;
  credential_type: "api_key" | "password" | "oauth_token" | "certificate";
  encrypted_data: string;
  encryption_key_id: string;
  metadata: {
    description?: string;
    expires_at?: string;
    last_used?: string;
    usage_count: number;
    auto_rotate: boolean;
  };
  created_at: string;
  updated_at: string;
}

interface StoreCredentialRequest {
  service_name: string;
  credential_type: "api_key" | "password" | "oauth_token" | "certificate";
  credential_data: {
    value: string;
    additional_fields?: Record<string, string>;
  };
  metadata?: {
    description?: string;
    expires_at?: string;
    auto_rotate?: boolean;
  };
  biometric_verification: BiometricCredential;
}

interface BiometricCredential {
  credential_id: string;
  challenge_response: string;
  authenticator_data: string;
  client_data_json: string;
}
```

## WebSocket API

### Connection & Authentication

```typescript
// WebSocket connection with authentication
const socket = io('wss://api.paios.dev', {
  auth: {
    token: 'jwt_token_here'
  }
});

// Connection events
interface SocketEvents {
  connect: () => void;
  disconnect: (reason: string) => void;
  error: (error: Error) => void;
  authenticated: (user: User) => void;
  unauthorized: (error: string) => void;
}
```

### Real-time Events

```typescript
interface WebSocketEvents {
  // Agent Events
  'agent:status_changed': (data: {
    agent_id: string;
    agent_number: number;
    old_status: AgentStatus;
    new_status: AgentStatus;
  }) => void;

  'agent:execution_started': (data: {
    agent_id: string;
    execution_id: string;
    command: AgentCommand;
  }) => void;

  'agent:execution_completed': (data: {
    agent_id: string;
    execution_id: string;
    result: AgentResponse;
    duration: number;
  }) => void;

  'agent:error': (data: {
    agent_id: string;
    error: string;
    context?: Record<string, any>;
  }) => void;

  // Voice Events
  'voice:command_received': (data: {
    text: string;
    confidence: number;
    language: string;
  }) => void;

  'voice:processing': (data: {
    status: 'transcribing' | 'analyzing' | 'routing' | 'executing';
    progress?: number;
  }) => void;

  'voice:response_ready': (data: {
    text: string;
    audio_url?: string;
    agent_response?: AgentResponse;
  }) => void;

  // System Events
  'system:architecture_updated': (data: {
    changes: SystemModification[];
    new_architecture: SystemArchitecture;
  }) => void;

  'system:performance_alert': (data: {
    alert_type: 'high_cpu' | 'high_memory' | 'slow_response' | 'agent_error';
    severity: 'warning' | 'critical';
    details: Record<string, any>;
  }) => void;

  'system:health_changed': (data: {
    old_health: SystemHealth;
    new_health: SystemHealth;
  }) => void;

  // Workflow Events
  'workflow:triggered': (data: {
    workflow_id: string;
    trigger_source: string;
    execution_id: string;
  }) => void;

  'workflow:step_completed': (data: {
    workflow_id: string;
    execution_id: string;
    step_id: string;
    result: any;
  }) => void;

  'workflow:completed': (data: {
    workflow_id: string;
    execution_id: string;
    success: boolean;
    duration: number;
    results: Record<string, any>;
  }) => void;

  // Cross-Agent Communication
  'agent:message': (data: {
    from_agent: number;
    to_agent: number;
    message_type: string;
    data: any;
    timestamp: string;
  }) => void;

  'agent:broadcast': (data: {
    from_agent: number;
    message_type: string;
    data: any;
    target_agents?: number[];
  }) => void;
}
```

### WebSocket Client API

```typescript
// Emit events to server
interface WebSocketClientEvents {
  // Join agent-specific room for updates
  'agent:subscribe': (agent_id: string) => void;
  'agent:unsubscribe': (agent_id: string) => void;

  // Send voice commands
  'voice:command': (data: VoiceProcessingRequest) => void;
  'voice:stop_listening': () => void;

  // System modifications
  'system:modify': (modification: SystemModification) => void;
  'system:subscribe_architecture': () => void;

  // Agent execution
  'agent:execute': (data: {
    agent_id: string;
    command: AgentCommand;
  }) => void;

  // Workflow control
  'workflow:execute': (workflow_id: string, data?: any) => void;
  'workflow:stop': (execution_id: string) => void;
}
```

## MCP Protocol Specification

### MCP Message Format

```typescript
interface MCPMessage {
  id: string;
  version: "1.0";
  type: "request" | "response" | "notification" | "error";
  method?: string; // For requests
  params?: Record<string, any>; // For requests
  result?: any; // For responses
  error?: MCPError; // For errors
  timestamp: string;
  source: {
    agent_number: number;
    agent_id: string;
  };
  target?: {
    agent_number?: number;
    agent_id?: string;
    broadcast?: boolean;
  };
}

interface MCPError {
  code: number;
  message: string;
  data?: any;
}
```

### MCP Methods

```typescript
// Agent Registration
interface RegisterAgentRequest {
  method: "agent.register";
  params: {
    agent_number: number;
    name: string;
    capabilities: string[];
    voice_commands: VoiceCommand[];
    config_schema: JSONSchema;
  };
}

// Agent Communication
interface SendMessageRequest {
  method: "agent.send_message";
  params: {
    target_agent: number;
    message_type: string;
    data: any;
    requires_response: boolean;
  };
}

// Workflow Execution
interface ExecuteWorkflowRequest {
  method: "workflow.execute";
  params: {
    workflow_id: string;
    input_data?: any;
    priority?: "low" | "normal" | "high";
  };
}

// System Queries
interface GetSystemStateRequest {
  method: "system.get_state";
  params: {
    include_agents?: boolean;
    include_workflows?: boolean;
    include_performance?: boolean;
  };
}

// Memory Operations
interface StoreMemoryRequest {
  method: "memory.store";
  params: {
    agent_number: number;
    memory_type: string;
    content: any;
    ttl?: number;
    tags?: string[];
  };
}

interface QueryMemoryRequest {
  method: "memory.query";
  params: {
    agent_number: number;
    memory_type?: string;
    tags?: string[];
    limit?: number;
    since?: string;
  };
}
```

## Error Handling

### Error Response Format

```typescript
interface APIError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
    timestamp: string;
    request_id: string;
  };
}

// Standard Error Codes
enum ErrorCodes {
  // Authentication Errors
  UNAUTHORIZED = "AUTH_001",
  BIOMETRIC_REQUIRED = "AUTH_002",
  TOKEN_EXPIRED = "AUTH_003",
  INVALID_CREDENTIALS = "AUTH_004",

  // Agent Errors
  AGENT_NOT_FOUND = "AGENT_001",
  AGENT_EXECUTION_FAILED = "AGENT_002",
  AGENT_TIMEOUT = "AGENT_003",
  AGENT_CONFIG_INVALID = "AGENT_004",
  AGENT_DISABLED = "AGENT_005",

  // Voice Errors
  VOICE_TRANSCRIPTION_FAILED = "VOICE_001",
  VOICE_COMMAND_NOT_UNDERSTOOD = "VOICE_002",
  VOICE_SERVICE_UNAVAILABLE = "VOICE_003",

  // System Errors
  SYSTEM_OVERLOADED = "SYSTEM_001",
  MODIFICATION_FAILED = "SYSTEM_002",
  ROLLBACK_FAILED = "SYSTEM_003",

  // Workflow Errors
  WORKFLOW_NOT_FOUND = "WORKFLOW_001",
  WORKFLOW_EXECUTION_FAILED = "WORKFLOW_002",
  WORKFLOW_VALIDATION_FAILED = "WORKFLOW_003",

  // General Errors
  VALIDATION_ERROR = "GENERAL_001",
  RATE_LIMIT_EXCEEDED = "GENERAL_002",
  INTERNAL_SERVER_ERROR = "GENERAL_003",
  SERVICE_UNAVAILABLE = "GENERAL_004"
}
```

## Rate Limiting

### Rate Limit Headers

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
X-RateLimit-Type: "user" | "ip" | "agent"
```

### Rate Limit Tiers

```typescript
interface RateLimitTiers {
  free: {
    requests_per_minute: 60;
    voice_commands_per_hour: 100;
    agent_executions_per_hour: 200;
    workflow_executions_per_day: 50;
  };
  pro: {
    requests_per_minute: 300;
    voice_commands_per_hour: 500;
    agent_executions_per_hour: 1000;
    workflow_executions_per_day: 500;
  };
  enterprise: {
    requests_per_minute: 1000;
    voice_commands_per_hour: 2000;
    agent_executions_per_hour: 5000;
    workflow_executions_per_day: 2000;
  };
}
```

## API Versioning

### Version Header
```http
Accept: application/vnd.paios.v1+json
API-Version: v1
```

### Backward Compatibility
- API versions are maintained for minimum 12 months
- Deprecation warnings included in responses 3 months before removal
- Breaking changes only in major version updates

## Security Considerations

### API Security Features
- JWT tokens with short expiration (15 minutes)
- Refresh tokens with rotation
- Biometric verification for sensitive operations
- Rate limiting per user and IP
- Request signing for critical operations
- Audit logging for all API calls
- CORS protection
- Input validation and sanitization
- SQL injection protection
- XSS protection

### Sensitive Operations Requiring Biometric
- Credential management (store, retrieve, delete)
- System architecture modifications
- Agent configuration changes
- Workflow creation/modification
- Account settings changes

This API specification provides a comprehensive foundation for building the Personal AI Operating System with proper authentication, real-time capabilities, voice control, and secure credential management.