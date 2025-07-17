-- Initial database schema for PAIOS

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX idx_users_email ON users(email);

-- Agents table
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  agent_number INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  config JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, agent_number)
);

-- Create indexes for agents
CREATE INDEX idx_agents_user_id ON agents(user_id);
CREATE INDEX idx_agents_number ON agents(agent_number);

-- Agent workflows table
CREATE TABLE agent_workflows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  source_agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  target_agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  trigger_conditions JSONB DEFAULT '{}',
  actions JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for workflows
CREATE INDEX idx_agent_workflows_user_id ON agent_workflows(user_id);
CREATE INDEX idx_agent_workflows_source ON agent_workflows(source_agent_id);
CREATE INDEX idx_agent_workflows_target ON agent_workflows(target_agent_id);

-- Voice interactions table
CREATE TABLE voice_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
  command_text TEXT NOT NULL,
  response_text TEXT,
  execution_status VARCHAR(50) DEFAULT 'pending',
  execution_time_ms INTEGER,
  confidence_score FLOAT,
  language VARCHAR(10) DEFAULT 'en-US',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for voice interactions
CREATE INDEX idx_voice_interactions_user_agent ON voice_interactions(user_id, agent_id);
CREATE INDEX idx_voice_interactions_created ON voice_interactions(created_at DESC);

-- Credentials table (encrypted)
CREATE TABLE credentials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  service_name VARCHAR(255) NOT NULL,
  username VARCHAR(255),
  encrypted_data TEXT NOT NULL,
  encryption_key_id VARCHAR(255) NOT NULL,
  url TEXT,
  notes TEXT,
  tags TEXT[],
  last_used TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for credentials
CREATE INDEX idx_credentials_user_id ON credentials(user_id);
CREATE INDEX idx_credentials_service ON credentials(service_name);
CREATE INDEX idx_credentials_tags ON credentials USING GIN(tags);

-- System modifications table
CREATE TABLE system_modifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  modification_type VARCHAR(100) NOT NULL,
  description TEXT,
  before_state JSONB,
  after_state JSONB,
  applied_at TIMESTAMP DEFAULT NOW(),
  rollback_available BOOLEAN DEFAULT true,
  rolled_back_at TIMESTAMP
);

-- Create index for system modifications
CREATE INDEX idx_system_modifications_user ON system_modifications(user_id);
CREATE INDEX idx_system_modifications_applied ON system_modifications(applied_at DESC);

-- Agent memory table
CREATE TABLE agent_memory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  memory_type VARCHAR(100) NOT NULL,
  content JSONB NOT NULL,
  relevance_score FLOAT DEFAULT 1.0,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for agent memory
CREATE INDEX idx_agent_memory_agent_type ON agent_memory(agent_id, memory_type);
CREATE INDEX idx_agent_memory_expires ON agent_memory(expires_at) WHERE expires_at IS NOT NULL;

-- Workflow executions table
CREATE TABLE workflow_executions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workflow_id UUID REFERENCES agent_workflows(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending',
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  result JSONB,
  error TEXT,
  execution_time_ms INTEGER
);

-- Create indexes for workflow executions
CREATE INDEX idx_workflow_executions_workflow ON workflow_executions(workflow_id);
CREATE INDEX idx_workflow_executions_user ON workflow_executions(user_id);
CREATE INDEX idx_workflow_executions_status ON workflow_executions(status);

-- User sessions table (for refresh tokens)
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  refresh_token VARCHAR(500) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for user sessions
CREATE INDEX idx_user_sessions_user ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_token ON user_sessions(refresh_token);
CREATE INDEX idx_user_sessions_expires ON user_sessions(expires_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON agents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agent_workflows_updated_at BEFORE UPDATE ON agent_workflows
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_credentials_updated_at BEFORE UPDATE ON credentials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();