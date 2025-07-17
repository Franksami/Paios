# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal AI Operating System (PAIOS) - A self-modifying AI agent system with voice control and real-time architecture visualization. The system appears as a minimalist portfolio website but functions as a unified AI workspace where each numbered accordion item connects to specialized AI agents.

## Common Development Commands

### Core Development
```bash
# Start all development services (frontend, backend, databases)
npm run dev

# Build entire project for production
npm run build

# Run all tests
npm run test

# Lint all code
npm run lint

# Fix linting issues
npm run lint:fix

# Type checking
npm run type-check
npm run type-check:frontend
npm run type-check:backend
```

### Database Management
```bash
# Run database migrations
npm run db:migrate

# Seed initial data
npm run db:seed

# Reset database (drop and recreate)
npm run db:reset

# Backup database
npm run db:backup

# Create new migration
npm run db:migration:create -- [migration_name]
```

### Agent Development
```bash
# Generate new agent scaffolding
npm run tools:generate-agent -- --number [num] --name "[Agent Name]"

# Test specific agent
npm run test:agent -- [agent-name]

# List all agents
npm run agent:list

# View agent logs
npm run agent:logs
```

### Testing
```bash
# Run unit tests only
npm run test:unit

# Run integration tests
npm run test:integration

# Run e2e tests
npm run test:e2e

# Run voice command tests
npm run test:voice

# Test with coverage
npm run test:coverage
```

### Docker Development
```bash
# Start all services with Docker
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild containers
docker-compose build
```

## Architecture Overview

### Technology Stack
- **Frontend**: Next.js 14+ with TypeScript, Tailwind CSS, Zustand, React Query, Framer Motion
- **Backend**: Node.js 20+ with Express, Socket.io, TypeScript
- **Database**: PostgreSQL 15+ (primary), Redis 7+ (cache/real-time)
- **AI Integration**: OpenAI GPT-4, Claude 3.5, Whisper API, ElevenLabs TTS
- **Agent Communication**: Custom MCP (Model Context Protocol) implementation
- **Security**: JWT auth, AES-256 encryption, biometric authentication

### Key Architectural Patterns

#### 1. Agent System Architecture
All agents extend the `MCPAgent` base class and implement these core methods:
- `initialize(config)`: Set up agent with configuration
- `execute(command)`: Process agent commands
- `processVoiceCommand(text)`: Handle voice input
- `cleanup()`: Graceful shutdown

Agents communicate through the MCP protocol using event-driven messaging, not direct calls.

#### 2. Voice Processing Pipeline
```
User Speech → Web Speech API → Whisper API → Command Parser → Agent Router → Agent Execution → Response Generation → ElevenLabs TTS → Audio Output
```

#### 3. Real-time Communication
- WebSocket connections for all live updates
- Redis pub/sub for cross-service communication
- Optimistic UI updates with server reconciliation
- Offline queue for disconnected operations

#### 4. Security Architecture
- Zero-trust model with JWT token validation
- Biometric authentication for sensitive operations (password vault)
- AES-256 encryption for credentials at rest
- Rate limiting and request signing for APIs

### Directory Structure
```
paios/
├── frontend/          # Next.js frontend application
├── backend/           # Node.js backend API
├── shared/           # Shared TypeScript types and utilities
├── agents/           # Agent specifications and configurations
├── deployment/       # Docker and deployment configs
└── tools/           # Development utilities
```

### Database Schema
Core tables include:
- `users`: User accounts and settings
- `agents`: Agent configurations per user
- `agent_workflows`: Cross-agent automation rules
- `voice_interactions`: Voice command history
- `credentials`: Encrypted credential storage
- `system_modifications`: Architecture change history
- `agent_memory`: Persistent agent context

## Agent Development Guidelines

### Currently Implemented Agents
1. **Business Intelligence** (#1): Revenue tracking, Stripe integration
7. **Web Scraping** (#7): Apify integration, data extraction
8. **Social Media** (#8): Multi-platform content management
15. **Invoicing** (#15): Invoice generation and delivery
18. **Research** (#18): Data gathering and report generation
29. **Publishing** (#29): Content distribution across platforms
30. **System Rules** (#30): Workflow automation engine
31. **System Architecture** (#31): Real-time system visualization
32. **Password Vault** (#32): Secure credential management
33. **Personal Directory** (#33): Bookmarks and shortcuts

### Voice Command Patterns
Agents should support natural language variations:
- "Show me agent 1" / "Open business intelligence" / "Revenue dashboard"
- "What's my revenue?" / "Show income" / "Financial status"
- Commands route based on context and keywords

## Development Best Practices

### Code Style
- **TypeScript strict mode** for all code
- **Functional programming** patterns preferred
- **Immutable data structures** for state
- **Result/Either patterns** for error handling
- **Pure functions** for business logic

### Testing Requirements
- Unit tests for all agent core functionality
- Integration tests for cross-agent workflows
- E2E tests for voice command flows
- Performance tests for real-time features

### Security Considerations
- Never log sensitive data (API keys, passwords)
- Validate all inputs on backend
- Use parameterized queries for database
- Implement proper CORS and CSP headers
- Rate limit all public endpoints

### Performance Optimization
- Use Redis caching for frequent queries
- Implement database query optimization with proper indexes
- Code splitting by agent functionality
- Lazy load agent components
- WebSocket connection pooling

## Troubleshooting Common Issues

### Voice Recognition Not Working
- Check browser microphone permissions
- Verify `NEXT_PUBLIC_VOICE_ENABLED=true` in frontend/.env.local
- Test with: `window.voiceController.processCommand("test")`

### Agent Execution Failures
- Check agent logs: `tail -f backend/logs/agents.log`
- Verify API keys in backend/.env
- Test individual agent: `npm run test:agent -- [agent-name]`

### WebSocket Connection Issues
- Verify backend is running: `curl http://localhost:3001/api/health`
- Check CORS settings in backend/src/config/websocket.ts
- Monitor WebSocket tab in browser dev tools

### Database Connection Problems
- Check PostgreSQL: `pg_isready -h localhost -p 5432`
- Verify DATABASE_URL in backend/.env
- Reset if needed: `npm run db:reset`

## Important Implementation Notes

1. **Hot-swappable Agents**: Agents can be updated without system restart through the hot-swap engine
2. **Voice-First Design**: Every feature should be accessible via voice commands
3. **Self-Documenting**: System explains its architecture as users interact
4. **Progressive Disclosure**: Complex features hidden behind simple numbered interface
5. **Real-time Transparency**: Users can see and modify agent communication flows

## External Service Requirements

Required API keys and accounts:
- OpenAI API (GPT-4, Whisper)
- Anthropic API (Claude)
- ElevenLabs (Text-to-speech)
- Stripe (Payment processing)
- Apify (Web scraping)
- Social media APIs (Twitter, Instagram, TikTok, LinkedIn)

Configure these in backend/.env before running the system.