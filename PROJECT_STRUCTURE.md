# Project Structure - Personal AI Operating System

## Overview
This document outlines the complete file and folder organization for the Personal AI Operating System (PAIOS). The structure follows modern full-stack development practices with clear separation of concerns, modular architecture, and scalable organization.

## Root Directory Structure

```
paios/
├── .cursorrules                      # Cursor IDE project rules
├── .env.example                      # Environment variables template
├── .env.local                        # Local environment variables (gitignored)
├── .gitignore                        # Git ignore patterns
├── docker-compose.yml                # Local development environment
├── package.json                      # Root package.json for workspace
├── README.md                         # Project overview and setup
├── PRD.md                           # Product Requirements Document
├── TECHNICAL_SPEC.md                # Technical architecture specification
├── PROJECT_STRUCTURE.md             # This file
├── API_SPEC.md                      # API documentation and specifications
├── SETUP_GUIDE.md                   # Development environment setup
├── 
├── frontend/                        # Next.js frontend application
├── backend/                         # Node.js backend API
├── shared/                          # Shared TypeScript types and utilities
├── docs/                           # Additional documentation
├── agents/                         # Agent specifications and configurations
├── deployment/                     # Deployment scripts and configurations
└── tools/                          # Development tools and scripts
```

## Frontend Structure (`frontend/`)

```
frontend/
├── .env.local                       # Frontend environment variables
├── .eslintrc.json                   # ESLint configuration
├── .gitignore                       # Frontend-specific gitignore
├── next.config.js                   # Next.js configuration
├── package.json                     # Frontend dependencies
├── postcss.config.js                # PostCSS configuration
├── tailwind.config.js               # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
├── 
├── public/                          # Static assets
│   ├── favicon.ico
│   ├── manifest.json                # PWA manifest
│   ├── sw.js                        # Service worker
│   └── icons/                       # App icons for PWA
├── 
├── src/                            # Source code
│   ├── app/                        # Next.js App Router
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Home page (main accordion interface)
│   │   ├── globals.css             # Global styles
│   │   ├── loading.tsx             # Global loading component
│   │   ├── error.tsx               # Global error component
│   │   └── api/                    # API routes (if any frontend APIs needed)
│   │
│   ├── components/                 # React components
│   │   ├── ui/                     # Base UI components
│   │   │   ├── accordion.tsx       # Main accordion component
│   │   │   ├── button.tsx          # Button variants
│   │   │   ├── input.tsx           # Input components
│   │   │   ├── modal.tsx           # Modal component
│   │   │   ├── toast.tsx           # Toast notifications
│   │   │   ├── voice-button.tsx    # Voice input button
│   │   │   └── loading-spinner.tsx # Loading indicators
│   │   │
│   │   ├── agents/                 # Agent-specific components
│   │   │   ├── agent-card.tsx      # Individual agent display
│   │   │   ├── agent-interface.tsx # Agent interaction interface
│   │   │   ├── voice-interface.tsx # Voice control interface
│   │   │   └── agent-status.tsx    # Agent status indicators
│   │   │
│   │   ├── system/                 # System management components
│   │   │   ├── architecture-viewer.tsx    # System diagram viewer
│   │   │   ├── workflow-editor.tsx        # Visual workflow editor
│   │   │   ├── performance-monitor.tsx    # Performance dashboard
│   │   │   ├── modification-history.tsx   # System change history
│   │   │   └── health-monitor.tsx         # System health display
│   │   │
│   │   ├── layout/                 # Layout components
│   │   │   ├── header.tsx          # Site header
│   │   │   ├── navigation.tsx      # Navigation elements
│   │   │   ├── sidebar.tsx         # Sidebar (if needed)
│   │   │   └── footer.tsx          # Site footer
│   │   │
│   │   └── features/               # Feature-specific components
│   │       ├── authentication/     # Auth-related components
│   │       ├── voice-control/      # Voice control features
│   │       ├── real-time/          # Real-time features
│   │       └── mobile/             # Mobile-specific components
│   │
│   ├── hooks/                      # Custom React hooks
│   │   ├── use-voice.ts           # Voice recognition and synthesis
│   │   ├── use-agents.ts          # Agent management
│   │   ├── use-websocket.ts       # WebSocket connection
│   │   ├── use-auth.ts            # Authentication
│   │   ├── use-biometric.ts       # Biometric authentication
│   │   ├── use-local-storage.ts   # Local storage management
│   │   └── use-system-health.ts   # System monitoring
│   │
│   ├── stores/                     # Zustand state stores
│   │   ├── agent-store.ts         # Agent state management
│   │   ├── voice-store.ts         # Voice state management
│   │   ├── system-store.ts        # System state management
│   │   ├── auth-store.ts          # Authentication state
│   │   └── ui-store.ts            # UI state (modals, toasts, etc.)
│   │
│   ├── lib/                       # Utility libraries
│   │   ├── api.ts                 # API client configuration
│   │   ├── mcp-client.ts          # MCP protocol client
│   │   ├── voice-processor.ts     # Voice processing utilities
│   │   ├── encryption.ts          # Frontend encryption utilities
│   │   ├── websocket.ts           # WebSocket client
│   │   ├── utils.ts               # General utilities
│   │   ├── constants.ts           # Application constants
│   │   └── validators.ts          # Input validation schemas
│   │
│   ├── types/                     # TypeScript type definitions
│   │   ├── agents.ts              # Agent-related types
│   │   ├── mcp.ts                 # MCP protocol types
│   │   ├── system.ts              # System architecture types
│   │   ├── voice.ts               # Voice interface types
│   │   ├── api.ts                 # API response types
│   │   └── common.ts              # Common/shared types
│   │
│   └── styles/                    # Additional styles
│       ├── components.css         # Component-specific styles
│       ├── animations.css         # Animation definitions
│       └── mobile.css             # Mobile-specific styles
```

## Backend Structure (`backend/`)

```
backend/
├── .env.example                    # Environment variables template
├── .env                           # Environment variables (gitignored)
├── .eslintrc.json                 # ESLint configuration
├── .gitignore                     # Backend gitignore
├── Dockerfile                     # Docker container definition
├── package.json                   # Backend dependencies
├── tsconfig.json                  # TypeScript configuration
├── jest.config.js                 # Jest testing configuration
├── 
├── src/                           # Source code
│   ├── index.ts                   # Application entry point
│   ├── app.ts                     # Express app configuration
│   ├── server.ts                  # Server startup logic
│   │
│   ├── config/                    # Configuration files
│   │   ├── database.ts            # Database configuration
│   │   ├── redis.ts               # Redis configuration
│   │   ├── auth.ts                # Authentication configuration
│   │   ├── websocket.ts           # WebSocket configuration
│   │   └── environment.ts         # Environment variable validation
│   │
│   ├── routes/                    # API route definitions
│   │   ├── index.ts               # Route registration
│   │   ├── agents.ts              # Agent management routes
│   │   ├── auth.ts                # Authentication routes
│   │   ├── voice.ts               # Voice processing routes
│   │   ├── workflows.ts           # Workflow management routes
│   │   ├── system.ts              # System management routes
│   │   ├── credentials.ts         # Credential management routes
│   │   └── health.ts              # Health check routes
│   │
│   ├── controllers/               # Route controllers
│   │   ├── agent-controller.ts    # Agent management logic
│   │   ├── auth-controller.ts     # Authentication logic
│   │   ├── voice-controller.ts    # Voice processing logic
│   │   ├── workflow-controller.ts # Workflow management logic
│   │   ├── system-controller.ts   # System management logic
│   │   └── credential-controller.ts # Credential management logic
│   │
│   ├── services/                  # Business logic services
│   │   ├── agent-service.ts       # Agent orchestration service
│   │   ├── mcp-service.ts         # MCP protocol service
│   │   ├── voice-service.ts       # Voice processing service
│   │   ├── workflow-service.ts    # Workflow execution service
│   │   ├── encryption-service.ts  # Encryption/decryption service
│   │   ├── notification-service.ts # Notification service
│   │   └── monitoring-service.ts  # Performance monitoring service
│   │
│   ├── agents/                    # Agent implementations
│   │   ├── base/                  # Base agent classes
│   │   │   ├── mcp-agent.ts       # Base MCP agent class
│   │   │   ├── voice-agent.ts     # Voice-enabled agent base
│   │   │   └── external-api-agent.ts # External API agent base
│   │   │
│   │   ├── business-intelligence/ # Agent #1
│   │   │   ├── index.ts
│   │   │   ├── config.ts
│   │   │   ├── stripe-integration.ts
│   │   │   └── analytics.ts
│   │   │
│   │   ├── web-scraping/          # Agent #7
│   │   │   ├── index.ts
│   │   │   ├── config.ts
│   │   │   ├── apify-integration.ts
│   │   │   └── data-processor.ts
│   │   │
│   │   ├── social-media/          # Agent #8
│   │   │   ├── index.ts
│   │   │   ├── config.ts
│   │   │   ├── platform-apis.ts
│   │   │   └── content-manager.ts
│   │   │
│   │   ├── invoicing/             # Agent #15
│   │   │   ├── index.ts
│   │   │   ├── config.ts
│   │   │   ├── template-engine.ts
│   │   │   └── email-service.ts
│   │   │
│   │   ├── research/              # Agent #18
│   │   │   ├── index.ts
│   │   │   ├── config.ts
│   │   │   ├── data-sources.ts
│   │   │   └── report-generator.ts
│   │   │
│   │   ├── publishing/            # Agent #29
│   │   │   ├── index.ts
│   │   │   ├── config.ts
│   │   │   ├── content-processor.ts
│   │   │   └── platform-publishers.ts
│   │   │
│   │   ├── system-rules/          # Agent #30
│   │   │   ├── index.ts
│   │   │   ├── config.ts
│   │   │   ├── rule-engine.ts
│   │   │   └── workflow-manager.ts
│   │   │
│   │   ├── system-architecture/   # Agent #31
│   │   │   ├── index.ts
│   │   │   ├── config.ts
│   │   │   ├── diagram-generator.ts
│   │   │   └── performance-analyzer.ts
│   │   │
│   │   ├── password-vault/        # Agent #32
│   │   │   ├── index.ts
│   │   │   ├── config.ts
│   │   │   ├── encryption-manager.ts
│   │   │   └── biometric-auth.ts
│   │   │
│   │   └── personal-directory/    # Agent #33
│   │       ├── index.ts
│   │       ├── config.ts
│   │       ├── bookmark-manager.ts
│   │       └── shortcut-processor.ts
│   │
│   ├── middleware/                # Express middleware
│   │   ├── auth.ts                # Authentication middleware
│   │   ├── rate-limit.ts          # Rate limiting
│   │   ├── cors.ts                # CORS configuration
│   │   ├── error-handler.ts       # Error handling middleware
│   │   ├── request-logger.ts      # Request logging
│   │   └── validation.ts          # Request validation
│   │
│   ├── models/                    # Database models
│   │   ├── index.ts               # Model exports
│   │   ├── user.ts                # User model
│   │   ├── agent.ts               # Agent model
│   │   ├── workflow.ts            # Workflow model
│   │   ├── voice-interaction.ts   # Voice interaction model
│   │   ├── credential.ts          # Credential model
│   │   ├── system-modification.ts # System modification model
│   │   └── agent-memory.ts        # Agent memory model
│   │
│   ├── database/                  # Database utilities
│   │   ├── connection.ts          # Database connection
│   │   ├── migrations/            # Database migrations
│   │   │   ├── 001_initial_schema.sql
│   │   │   ├── 002_add_voice_interactions.sql
│   │   │   ├── 003_add_workflows.sql
│   │   │   └── 004_add_agent_memory.sql
│   │   ├── seeds/                 # Database seed data
│   │   │   ├── users.ts
│   │   │   ├── agents.ts
│   │   │   └── default-workflows.ts
│   │   └── queries.ts             # Common database queries
│   │
│   ├── websocket/                 # WebSocket handling
│   │   ├── server.ts              # WebSocket server setup
│   │   ├── handlers/              # WebSocket event handlers
│   │   │   ├── agent-events.ts
│   │   │   ├── voice-events.ts
│   │   │   ├── system-events.ts
│   │   │   └── workflow-events.ts
│   │   └── middleware.ts          # WebSocket middleware
│   │
│   ├── utils/                     # Utility functions
│   │   ├── logger.ts              # Logging utilities
│   │   ├── encryption.ts          # Encryption utilities
│   │   ├── validators.ts          # Validation schemas
│   │   ├── constants.ts           # Application constants
│   │   ├── helpers.ts             # General helper functions
│   │   └── error-types.ts         # Custom error types
│   │
│   └── types/                     # TypeScript type definitions
│       ├── index.ts               # Type exports
│       ├── agent.ts               # Agent-related types
│       ├── mcp.ts                 # MCP protocol types
│       ├── voice.ts               # Voice processing types
│       ├── workflow.ts            # Workflow types
│       ├── system.ts              # System types
│       ├── database.ts            # Database types
│       └── external-apis.ts       # External API types
│
├── tests/                         # Test files
│   ├── setup.ts                   # Test setup configuration
│   ├── unit/                      # Unit tests
│   │   ├── agents/                # Agent unit tests
│   │   ├── services/              # Service unit tests
│   │   ├── controllers/           # Controller unit tests
│   │   └── utils/                 # Utility unit tests
│   ├── integration/               # Integration tests
│   │   ├── api/                   # API integration tests
│   │   ├── database/              # Database integration tests
│   │   ├── websocket/             # WebSocket integration tests
│   │   └── workflows/             # Workflow integration tests
│   └── e2e/                       # End-to-end tests
│       ├── agent-communication.test.ts
│       ├── voice-commands.test.ts
│       └── system-modification.test.ts
```

## Shared Directory (`shared/`)

```
shared/
├── package.json                   # Shared dependencies
├── tsconfig.json                  # Shared TypeScript config
├── 
├── types/                         # Shared TypeScript types
│   ├── index.ts                   # Type exports
│   ├── agent.ts                   # Agent interfaces
│   ├── mcp.ts                     # MCP protocol definitions
│   ├── voice.ts                   # Voice interface types
│   ├── system.ts                  # System architecture types
│   ├── workflow.ts                # Workflow definitions
│   ├── api.ts                     # API contract types
│   └── common.ts                  # Common utility types
├── 
├── constants/                     # Shared constants
│   ├── agent-numbers.ts           # Agent number definitions
│   ├── voice-commands.ts          # Voice command patterns
│   ├── system-events.ts           # System event types
│   └── api-endpoints.ts           # API endpoint constants
├── 
├── utils/                         # Shared utilities
│   ├── validation.ts              # Shared validation schemas
│   ├── formatting.ts              # Data formatting utilities
│   ├── date-utils.ts              # Date manipulation utilities
│   └── string-utils.ts            # String manipulation utilities
└── 
└── schemas/                       # Validation schemas
    ├── agent-config.ts            # Agent configuration schemas
    ├── voice-command.ts           # Voice command schemas
    ├── workflow.ts                # Workflow schemas
    └── system-modification.ts     # System modification schemas
```

## Agent Specifications (`agents/`)

```
agents/
├── README.md                      # Agent development guide
├── agent-template/                # Template for new agents
│   ├── index.ts                   # Agent implementation template
│   ├── config.schema.json         # Configuration schema
│   ├── README.md                  # Agent documentation template
│   └── test.template.ts           # Test template
├── 
├── specifications/                # Individual agent specs
│   ├── 01-business-intelligence.md
│   ├── 07-web-scraping.md
│   ├── 08-social-media.md
│   ├── 15-invoicing.md
│   ├── 18-research.md
│   ├── 29-publishing.md
│   ├── 30-system-rules.md
│   ├── 31-system-architecture.md
│   ├── 32-password-vault.md
│   └── 33-personal-directory.md
├── 
├── configurations/                # Agent configuration files
│   ├── default-configs.json       # Default agent configurations
│   ├── voice-commands.json        # Voice command mappings
│   ├── workflow-templates.json    # Workflow templates
│   └── integration-configs.json   # External API configurations
└── 
└── examples/                      # Example agent implementations
    ├── simple-agent.ts            # Basic agent example
    ├── voice-enabled-agent.ts     # Voice-enabled agent example
    ├── api-integration-agent.ts   # External API agent example
    └── workflow-agent.ts          # Workflow-enabled agent example
```

## Documentation (`docs/`)

```
docs/
├── README.md                      # Documentation overview
├── 
├── development/                   # Development documentation
│   ├── getting-started.md         # Quick start guide
│   ├── architecture-overview.md   # System architecture explanation
│   ├── agent-development.md       # How to build agents
│   ├── voice-integration.md       # Voice system integration
│   ├── mcp-protocol.md           # MCP protocol documentation
│   └── testing-guide.md          # Testing best practices
├── 
├── user-guides/                   # User documentation
│   ├── basic-usage.md            # Basic system usage
│   ├── voice-commands.md         # Voice command reference
│   ├── agent-configuration.md    # Agent setup and configuration
│   ├── workflow-creation.md      # Creating custom workflows
│   └── troubleshooting.md        # Common issues and solutions
├── 
├── api/                          # API documentation
│   ├── rest-api.md               # REST API documentation
│   ├── websocket-api.md          # WebSocket API documentation
│   ├── mcp-api.md                # MCP protocol API
│   └── authentication.md         # Authentication documentation
├── 
└── deployment/                   # Deployment documentation
    ├── local-development.md      # Local setup instructions
    ├── production-deployment.md  # Production deployment guide
    ├── docker-setup.md           # Docker configuration
    ├── monitoring-setup.md       # Monitoring and alerting setup
    └── security-considerations.md # Security best practices
```

## Deployment (`deployment/`)

```
deployment/
├── docker/                       # Docker configurations
│   ├── Dockerfile.frontend       # Frontend Docker image
│   ├── Dockerfile.backend        # Backend Docker image
│   ├── docker-compose.yml        # Local development compose
│   ├── docker-compose.prod.yml   # Production compose
│   └── nginx.conf                # Nginx configuration
├── 
├── kubernetes/                   # Kubernetes manifests (if using K8s)
│   ├── namespace.yaml
│   ├── configmap.yaml
│   ├── secrets.yaml
│   ├── deployments.yaml
│   ├── services.yaml
│   └── ingress.yaml
├── 
├── scripts/                      # Deployment scripts
│   ├── deploy.sh                 # Main deployment script
│   ├── build.sh                  # Build script
│   ├── test.sh                   # Testing script
│   ├── backup.sh                 # Database backup script
│   └── rollback.sh               # Rollback script
├── 
├── terraform/                    # Infrastructure as Code (if using)
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   └── modules/
├── 
└── monitoring/                   # Monitoring configurations
    ├── prometheus.yml            # Prometheus configuration
    ├── grafana-dashboard.json    # Grafana dashboard
    ├── alerting-rules.yml        # Alert rules
    └── log-config.yml            # Logging configuration
```

## Tools (`tools/`)

```
tools/
├── development/                  # Development tools
│   ├── db-migrate.ts            # Database migration tool
│   ├── seed-data.ts             # Database seeding tool
│   ├── agent-generator.ts       # Agent scaffolding tool
│   ├── type-generator.ts        # Type generation tool
│   └── test-runner.ts           # Custom test runner
├── 
├── deployment/                   # Deployment tools
│   ├── build-checker.ts         # Build validation tool
│   ├── env-validator.ts         # Environment validation
│   ├── health-checker.ts        # Health check tool
│   └── performance-tester.ts    # Performance testing tool
├── 
└── utilities/                    # General utilities
    ├── log-analyzer.ts           # Log analysis tool
    ├── data-exporter.ts          # Data export utility
    ├── backup-tool.ts            # Backup utility
    └── cleanup-tool.ts           # Cleanup utility
```

## Configuration Files

### Root `.cursorrules`
```markdown
# Personal AI Operating System - Cursor Rules

## Project Overview
This is a self-modifying AI agent system with voice control and real-time architecture visualization. Focus on clean, maintainable code that teaches users about system architecture through interaction.

## Code Standards
- Use TypeScript for all new code
- Follow functional programming patterns where possible
- Implement comprehensive error handling
- Write self-documenting code with clear variable names
- Use consistent naming conventions across frontend/backend

## Architecture Principles
- Agents should be hot-swappable modules
- All agent communication goes through MCP protocol
- Voice commands should work globally and per-agent
- System should be self-documenting and transparent
- Security-first approach for credential management

## Testing Requirements
- Unit tests for all agents
- Integration tests for cross-agent communication
- E2E tests for voice commands
- Performance tests for real-time features

## Agent Development
- Follow the base agent class pattern
- Implement voice command parsing
- Use structured configuration schemas
- Include comprehensive error handling
- Document all external API integrations

## Voice Interface
- Natural language command parsing
- Global command routing to appropriate agents
- Voice feedback for all actions
- Fallback text interface for accessibility

## Real-time Features
- WebSocket for all live updates
- Efficient caching strategies
- Optimistic UI updates
- Graceful degradation for offline
```

### Package.json (Root)
```json
{
  "name": "personal-ai-operating-system",
  "version": "1.0.0",
  "description": "A self-modifying AI agent system with voice control and architecture visualization",
  "private": true,
  "workspaces": [
    "frontend",
    "backend",
    "shared"
  ],
  "scripts": {
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "dev:frontend": "cd frontend && npm run dev",
    "dev:backend": "cd backend && npm run dev",
    "build": "npm run build:shared && npm run build:backend && npm run build:frontend",
    "build:shared": "cd shared && npm run build",
    "build:frontend": "cd frontend && npm run build",
    "build:backend": "cd backend && npm run build",
    "test": "npm run test:shared && npm run test:backend && npm run test:frontend",
    "test:shared": "cd shared && npm run test",
    "test:frontend": "cd frontend && npm run test",
    "test:backend": "cd backend && npm run test",
    "lint": "npm run lint:frontend && npm run lint:backend",
    "lint:frontend": "cd frontend && npm run lint",
    "lint:backend": "cd backend && npm run lint",
    "type-check": "npm run type-check:frontend && npm run type-check:backend",
    "type-check:frontend": "cd frontend && npm run type-check",
    "type-check:backend": "cd backend && npm run type-check"
  },
  "devDependencies": {
    "concurrently": "^8.2.0",
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  }
}
```

This structure provides:
- **Clear separation of concerns** between frontend, backend, and shared code
- **Modular agent architecture** that supports hot-swapping and easy testing
- **Comprehensive documentation** structure for both developers and users
- **Scalable organization** that can grow with additional agents and features
- **Professional deployment** setup with Docker, CI/CD, and monitoring
- **Development tooling** that supports the unique requirements of this project

Each directory includes detailed organization for the specific needs of building a self-modifying AI system with voice control and real-time visualization capabilities.