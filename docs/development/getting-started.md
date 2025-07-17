# Getting Started with PAIOS Development

This guide will help you get started with developing for the Personal AI Operating System.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 20.0.0 or higher
- npm 9.0.0 or higher
- Docker and Docker Compose
- Git

## Initial Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/paios.git
   cd paios
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   cp frontend/.env.example frontend/.env.local
   cp backend/.env.example backend/.env
   ```

4. **Start development services**
   ```bash
   docker-compose up -d  # Start databases
   npm run dev          # Start frontend and backend
   ```

## Project Structure

```
paios/
├── frontend/      # Next.js frontend application
├── backend/       # Node.js Express API
├── shared/        # Shared TypeScript types
├── agents/        # Agent specifications
├── deployment/    # Deployment configurations
├── tools/         # Development utilities
└── docs/          # Documentation
```

## Development Workflow

### 1. Making Changes

- Frontend code: `frontend/src/`
- Backend code: `backend/src/`
- Shared types: `shared/src/`

### 2. Running Tests

```bash
npm run test        # Run all tests
npm run test:unit   # Unit tests only
npm run lint        # Check code style
```

### 3. Building

```bash
npm run build       # Build all packages
```

## Common Tasks

### Creating a New Agent
```bash
npm run tools:generate-agent -- --number 34 --name "My Agent"
```

### Running Database Migrations
```bash
npm run db:migrate
```

### Viewing Logs
```bash
docker-compose logs -f
```

## Next Steps

- Read the [Architecture Overview](architecture-overview.md)
- Learn about [Agent Development](agent-development.md)
- Explore the [API Documentation](../api/rest-api.md)

## Getting Help

- Check the [Troubleshooting Guide](../user-guides/troubleshooting.md)
- Review existing [GitHub Issues](https://github.com/yourusername/paios/issues)
- Join our community Discord server