# Personal AI Operating System (PAIOS)

A self-modifying AI agent system with voice control and real-time architecture visualization. PAIOS appears as a minimalist portfolio website but functions as a unified AI workspace where each numbered accordion item connects to specialized AI agents.

## 🚀 Quick Start

### Prerequisites
- Node.js 20.0.0+
- npm 9.0.0+
- Docker 24.0.0+ and Docker Compose 2.0.0+
- PostgreSQL 15+ (or use Docker)
- Redis 7+ (or use Docker)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/paios.git
cd paios
```

2. Copy environment variables:
```bash
cp .env.example .env.local
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
```

3. Start with Docker:
```bash
docker-compose up -d
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

4. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api/health

## 🏗️ Architecture

PAIOS uses a microservices architecture with the following components:

- **Frontend**: Next.js 14+ with TypeScript, Tailwind CSS, and real-time updates
- **Backend**: Node.js with Express, Socket.io, and MCP protocol
- **Database**: PostgreSQL for persistent data, Redis for caching
- **AI Integration**: OpenAI GPT-4, Claude, Whisper API, ElevenLabs TTS
- **Agents**: 10 specialized AI agents accessible through voice or UI

## 🤖 Available Agents

1. **Business Intelligence** - Revenue tracking and analytics
7. **Web Scraping** - Data extraction with Apify
8. **Social Media** - Multi-platform content management
15. **Invoicing** - Automated invoice generation
18. **Research** - Data gathering and reports
29. **Publishing** - Content distribution
30. **System Rules** - Workflow automation
31. **System Architecture** - Real-time visualization
32. **Password Vault** - Secure credential storage
33. **Personal Directory** - Bookmarks and shortcuts

## 🎯 Key Features

- **Voice Control**: Natural language commands for all agents
- **Real-time Updates**: WebSocket-based live data
- **Self-Modifying**: System can update its own architecture
- **Hot-Swappable Agents**: Update agents without restart
- **Biometric Security**: For sensitive operations
- **Progressive Disclosure**: Complex features behind simple UI

## 📚 Documentation

- [Setup Guide](docs/SETUP_GUIDE.md)
- [Technical Specification](docs/TECHNICAL_SPEC.md)
- [API Documentation](docs/API_SPEC.md)
- [Agent Development](docs/development/agent-development.md)
- [Voice Commands](docs/user-guides/voice-commands.md)

## 🛠️ Development

### Common Commands

```bash
# Development
npm run dev              # Start all services
npm run build            # Build for production
npm run test             # Run all tests
npm run lint             # Lint code
npm run type-check       # TypeScript checks

# Database
npm run db:migrate       # Run migrations
npm run db:seed          # Seed data
npm run db:reset         # Reset database

# Agents
npm run tools:generate-agent -- --number 34 --name "New Agent"
npm run test:agent -- business-intelligence
npm run agent:list       # List all agents

# Docker
npm run docker:up        # Start services
npm run docker:down      # Stop services
npm run docker:logs      # View logs
```

### Project Structure

```
paios/
├── frontend/            # Next.js frontend
├── backend/             # Node.js API
├── shared/              # Shared types
├── agents/              # Agent specs
├── deployment/          # Deploy configs
├── tools/               # Dev tools
└── docs/                # Documentation
```

## 🔐 Security

- JWT authentication with short expiration
- AES-256 encryption for sensitive data
- Biometric authentication for password vault
- Rate limiting and CORS protection
- Input validation and SQL injection prevention

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for GPT-4 and Whisper API
- Anthropic for Claude API
- ElevenLabs for text-to-speech
- All contributors and testers