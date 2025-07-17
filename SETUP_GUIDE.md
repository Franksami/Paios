# Development Environment Setup Guide

## Overview
This guide will walk you through setting up the complete development environment for the Personal AI Operating System (PAIOS). Follow these steps to get your local development environment running.

## Prerequisites

### Required Software
- **Node.js** 20.0.0 or higher
- **npm** 9.0.0 or higher (or yarn/pnpm)
- **Docker** 24.0.0 or higher
- **Docker Compose** 2.0.0 or higher
- **Git** 2.30.0 or higher
- **PostgreSQL** 15.0 or higher (optional if using Docker)
- **Redis** 7.0 or higher (optional if using Docker)

### Development Tools
- **VS Code** with Cursor extension (recommended)
- **Postman** or **Insomnia** for API testing
- **TablePlus** or **pgAdmin** for database management
- **Redis Commander** for Redis management

### External Service Accounts
You'll need accounts and API keys for:
- **OpenAI** (GPT-4, Whisper API)
- **Anthropic** (Claude API)
- **ElevenLabs** (Text-to-speech)
- **Stripe** (Payment processing)
- **Apify** (Web scraping)
- **Social Media APIs** (Twitter, Instagram, TikTok, LinkedIn)

## Quick Start (Docker)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/paios.git
cd paios
```

### 2. Environment Configuration
```bash
# Copy environment templates
cp .env.example .env.local
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env

# Edit environment files with your configuration
nano .env.local
```

### 3. Start Development Environment
```bash
# Start all services with Docker Compose
docker-compose up -d

# Install dependencies
npm install

# Run database migrations
npm run db:migrate

# Seed initial data
npm run db:seed

# Start development servers
npm run dev
```

### 4. Verify Installation
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api/health
- Database: localhost:5432
- Redis: localhost:6379

## Manual Installation

### 1. Database Setup

#### PostgreSQL
```bash
# Install PostgreSQL (macOS)
brew install postgresql@15
brew services start postgresql@15

# Create database
createdb paios_development
createdb paios_test

# Create user
psql postgres
CREATE USER paios_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE paios_development TO paios_user;
GRANT ALL PRIVILEGES ON DATABASE paios_test TO paios_user;
\q
```

#### Redis
```bash
# Install Redis (macOS)
brew install redis
brew services start redis

# Verify Redis is running
redis-cli ping
# Should return: PONG
```

### 2. Project Setup

#### Install Dependencies
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..

# Install backend dependencies
cd backend
npm install
cd ..

# Install shared dependencies
cd shared
npm install
cd ..
```

#### Build Shared Package
```bash
cd shared
npm run build
cd ..
```

### 3. Environment Configuration

#### Root Environment (.env.local)
```env
# Development Environment
NODE_ENV=development
LOG_LEVEL=debug

# Database
DATABASE_URL=postgresql://paios_user:your_password@localhost:5432/paios_development
TEST_DATABASE_URL=postgresql://paios_user:your_password@localhost:5432/paios_test

# Redis
REDIS_URL=redis://localhost:6379

# Security
JWT_SECRET=your_super_secret_jwt_key_here
ENCRYPTION_KEY=your_32_character_encryption_key

# External APIs
OPENAI_API_KEY=sk-your-openai-key
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key
ELEVENLABS_API_KEY=your-elevenlabs-key
```

#### Frontend Environment (frontend/.env.local)
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_WS_URL=ws://localhost:3001

# Voice Services
NEXT_PUBLIC_VOICE_ENABLED=true
NEXT_PUBLIC_WAKE_WORD_ENABLED=false

# Features
NEXT_PUBLIC_BIOMETRIC_AUTH=true
NEXT_PUBLIC_PWA_ENABLED=true

# Analytics (optional)
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=
NEXT_PUBLIC_SENTRY_DSN=
```

#### Backend Environment (backend/.env)
```env
# Server Configuration
PORT=3001
HOST=localhost
NODE_ENV=development

# Database
DATABASE_URL=postgresql://paios_user:your_password@localhost:5432/paios_development
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# Encryption
ENCRYPTION_KEY=your_32_character_encryption_key
BIOMETRIC_RP_ID=localhost
BIOMETRIC_RP_NAME=PAIOS Development

# External APIs
OPENAI_API_KEY=sk-your-openai-key
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key
ELEVENLABS_API_KEY=your-elevenlabs-key

# Third-party Integrations
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
APIFY_API_TOKEN=your-apify-token

# Social Media APIs
TWITTER_API_KEY=your-twitter-key
TWITTER_API_SECRET=your-twitter-secret
INSTAGRAM_ACCESS_TOKEN=your-instagram-token
TIKTOK_CLIENT_KEY=your-tiktok-key
LINKEDIN_CLIENT_ID=your-linkedin-id

# Monitoring
SENTRY_DSN=your-sentry-dsn
LOG_LEVEL=debug
```

### 4. Database Migration and Seeding

#### Run Migrations
```bash
cd backend
npm run db:migrate
```

#### Seed Initial Data
```bash
npm run db:seed
```

#### Verify Database Setup
```bash
# Connect to database
psql postgresql://paios_user:your_password@localhost:5432/paios_development

# Check tables
\dt

# Check sample data
SELECT * FROM users LIMIT 5;
SELECT * FROM agents LIMIT 5;
\q
```

### 5. Start Development Servers

#### Option 1: Start All Services
```bash
# From root directory
npm run dev
```

#### Option 2: Start Services Individually
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev

# Terminal 3: Shared package (watch mode)
cd shared
npm run dev
```

### 6. Verify Installation

#### Health Checks
```bash
# Backend health check
curl http://localhost:3001/api/health

# Database connection test
curl http://localhost:3001/api/system/health

# Redis connection test
redis-cli -h localhost -p 6379 ping
```

#### Frontend Access
- Open http://localhost:3000
- You should see the minimalist accordion interface
- Try expanding one of the numbered items

## Development Workflow

### 1. Agent Development

#### Create New Agent
```bash
# Use the agent generator tool
npm run tools:generate-agent -- --number 34 --name "Custom Agent"

# This creates:
# - agents/specifications/34-custom-agent.md
# - backend/src/agents/custom-agent/
# - Tests and configuration files
```

#### Agent Development Cycle
```bash
# 1. Implement agent logic
# Edit: backend/src/agents/your-agent/index.ts

# 2. Update configuration
# Edit: backend/src/agents/your-agent/config.ts

# 3. Add voice commands
# Edit: agents/configurations/voice-commands.json

# 4. Write tests
# Edit: backend/tests/unit/agents/your-agent.test.ts

# 5. Test agent
npm run test:agent -- your-agent

# 6. Hot-reload in development
# Changes are automatically reloaded
```

### 2. Frontend Development

#### Component Development
```bash
# Start frontend in watch mode
cd frontend
npm run dev

# File changes trigger automatic reload
# New components should follow the pattern:
# - src/components/agents/ for agent-specific UI
# - src/components/system/ for system management
# - src/components/ui/ for reusable components
```

#### Voice Interface Testing
```bash
# Enable voice debugging
export NEXT_PUBLIC_VOICE_DEBUG=true

# Test voice commands in browser console:
# window.voiceController.processCommand("show me agent 1")
```

### 3. Testing

#### Run All Tests
```bash
npm run test
```

#### Run Specific Test Suites
```bash
# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration

# Agent-specific tests
npm run test:agent -- business-intelligence

# Voice command tests
npm run test:voice

# Frontend component tests
cd frontend
npm run test
```

#### Manual Testing Checklist
- [ ] Accordion interface loads and functions
- [ ] Voice commands work in at least one agent
- [ ] WebSocket connection establishes
- [ ] Agent execution completes successfully
- [ ] System architecture view displays
- [ ] Password vault requires biometric authentication
- [ ] Cross-agent communication works
- [ ] Real-time updates appear in UI

## Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check PostgreSQL is running
brew services list | grep postgresql

# Check connection
psql postgresql://paios_user:your_password@localhost:5432/paios_development

# Reset database if needed
npm run db:reset
```

#### Redis Connection Issues
```bash
# Check Redis is running
brew services list | grep redis

# Test connection
redis-cli ping

# Restart Redis
brew services restart redis
```

#### Voice Recognition Not Working
```bash
# Check browser permissions
# Chrome: Settings > Privacy and security > Site Settings > Microphone

# Verify environment variables
echo $NEXT_PUBLIC_VOICE_ENABLED

# Check microphone access in browser console:
# navigator.mediaDevices.getUserMedia({ audio: true })
```

#### WebSocket Connection Issues
```bash
# Check backend is running
curl http://localhost:3001/api/health

# Check WebSocket endpoint
# Browser dev tools > Network > WS tab
# Should show connection to ws://localhost:3001

# Verify CORS settings in backend/src/config/websocket.ts
```

#### Agent Execution Failures
```bash
# Check agent logs
tail -f backend/logs/agents.log

# Verify API keys in environment
echo $OPENAI_API_KEY | head -c 10

# Test individual agent
curl -X POST http://localhost:3001/api/agents/1/execute \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_jwt_token" \
  -d '{"command": {"action": "test", "parameters": {}}}'
```

### Development Tools

#### Database Management
```bash
# Reset database
npm run db:reset

# Create new migration
npm run db:migration:create -- add_new_feature

# Rollback migration
npm run db:migration:rollback

# Database backup
npm run db:backup

# Restore database
npm run db:restore backup_file.sql
```

#### Code Quality
```bash
# Lint all code
npm run lint

# Fix linting issues
npm run lint:fix

# Type checking
npm run type-check

# Format code
npm run format
```

#### Monitoring
```bash
# View application logs
npm run logs

# Monitor performance
npm run monitor

# Check system health
npm run health-check
```

## Production Deployment Preparation

### 1. Environment Variables
```bash
# Create production environment file
cp .env.example .env.production

# Update with production values:
# - Secure JWT secrets
# - Production database URLs
# - Production API keys
# - Domain-specific settings
```

### 2. Build Process
```bash
# Test production build
npm run build

# Verify build output
npm run start:prod
```

### 3. Security Checklist
- [ ] Change all default passwords and secrets
- [ ] Enable HTTPS in production
- [ ] Configure proper CORS origins
- [ ] Set up rate limiting
- [ ] Enable audit logging
- [ ] Configure backup systems
- [ ] Set up monitoring and alerting

## Getting Help

### Documentation
- Check `docs/` directory for detailed guides
- Review agent specifications in `agents/specifications/`
- API documentation in `API_SPEC.md`

### Common Commands Reference
```bash
# Development
npm run dev                    # Start all development servers
npm run build                  # Build for production
npm run test                   # Run all tests
npm run lint                   # Check code quality

# Database
npm run db:migrate            # Run migrations
npm run db:seed              # Seed data
npm run db:reset             # Reset database

# Tools
npm run tools:generate-agent  # Create new agent
npm run tools:health-check   # System health check
npm run tools:performance   # Performance analysis

# Agent Management
npm run agent:list           # List all agents
npm run agent:test           # Test specific agent
npm run agent:logs           # View agent logs
```

### Support Resources
- Project documentation: `docs/`
- API reference: `API_SPEC.md`
- Architecture guide: `TECHNICAL_SPEC.md`
- Agent development: `agents/README.md`

You're now ready to start developing the Personal AI Operating System! The development environment provides hot-reloading, comprehensive testing, and all the tools needed to build and modify agents, implement voice controls, and create real-time system visualizations.