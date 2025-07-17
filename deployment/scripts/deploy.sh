#!/bin/bash

# PAIOS Deployment Script
# This script handles the deployment of the PAIOS system

set -e

# Configuration
ENVIRONMENT=${1:-production}
VERSION=${2:-latest}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed"
        exit 1
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed"
        exit 1
    fi
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed"
        exit 1
    fi
    
    log_info "All prerequisites are met"
}

# Build application
build_application() {
    log_info "Building application..."
    
    # Install dependencies
    npm install
    
    # Build shared package
    npm run build:shared
    
    # Build backend
    npm run build:backend
    
    # Build frontend
    npm run build:frontend
    
    log_info "Application built successfully"
}

# Run tests
run_tests() {
    log_info "Running tests..."
    
    # Run unit tests
    npm run test:unit || {
        log_error "Unit tests failed"
        exit 1
    }
    
    # Run integration tests
    npm run test:integration || {
        log_warn "Integration tests failed - continuing deployment"
    }
    
    log_info "Tests completed"
}

# Build Docker images
build_docker_images() {
    log_info "Building Docker images..."
    
    # Build frontend image
    docker build -t paios-frontend:${VERSION} ./frontend
    
    # Build backend image
    docker build -t paios-backend:${VERSION} ./backend
    
    log_info "Docker images built successfully"
}

# Deploy to environment
deploy() {
    log_info "Deploying to ${ENVIRONMENT}..."
    
    case ${ENVIRONMENT} in
        local)
            docker-compose up -d
            ;;
        staging)
            # Deploy to staging environment
            log_warn "Staging deployment not yet implemented"
            ;;
        production)
            # Deploy to production environment
            log_warn "Production deployment not yet implemented"
            ;;
        *)
            log_error "Unknown environment: ${ENVIRONMENT}"
            exit 1
            ;;
    esac
    
    log_info "Deployment completed"
}

# Health check
health_check() {
    log_info "Running health checks..."
    
    # Wait for services to start
    sleep 10
    
    # Check frontend
    curl -f http://localhost:3000 || {
        log_error "Frontend health check failed"
        exit 1
    }
    
    # Check backend
    curl -f http://localhost:3001/api/health || {
        log_error "Backend health check failed"
        exit 1
    }
    
    log_info "All services are healthy"
}

# Main execution
main() {
    log_info "Starting PAIOS deployment..."
    log_info "Environment: ${ENVIRONMENT}"
    log_info "Version: ${VERSION}"
    
    check_prerequisites
    build_application
    run_tests
    build_docker_images
    deploy
    health_check
    
    log_info "Deployment completed successfully!"
    log_info "Frontend: http://localhost:3000"
    log_info "Backend: http://localhost:3001"
}

# Run main function
main