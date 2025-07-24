#!/bin/bash

# NHS Triage App - Build and Deploy Script

set -e

# Configuration
APP_NAME="nhs-triage-app"
VERSION=${1:-"latest"}
REGISTRY=${DOCKER_REGISTRY:-""}
BUILD_DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
GIT_COMMIT=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Help function
show_help() {
    cat << EOF
NHS Triage App - Build and Deploy Script

Usage: $0 [VERSION] [COMMAND]

Commands:
    build           Build Docker image (default)
    push            Build and push to registry
    deploy          Deploy locally with docker-compose
    deploy-prod     Deploy for production
    clean           Clean up images and containers
    help            Show this help

Examples:
    $0                          # Build with latest tag
    $0 v1.0.0                   # Build with specific version
    $0 latest push              # Build and push to registry
    $0 latest deploy            # Build and deploy locally
    $0 latest deploy-prod       # Deploy for production

Environment Variables:
    DOCKER_REGISTRY             Docker registry URL
    REACT_APP_OPENAI_API_KEY    OpenAI API key
    REACT_APP_OPENAI_MODEL      OpenAI model (default: gpt-4o)

EOF
}

# Build function
build_image() {
    log_info "Building Docker image: ${APP_NAME}:${VERSION}"
    
    docker build \
        --build-arg BUILD_DATE="${BUILD_DATE}" \
        --build-arg GIT_COMMIT="${GIT_COMMIT}" \
        --build-arg VERSION="${VERSION}" \
        -t "${APP_NAME}:${VERSION}" \
        .
    
    if [ -n "$REGISTRY" ]; then
        docker tag "${APP_NAME}:${VERSION}" "${REGISTRY}/${APP_NAME}:${VERSION}"
        log_success "Tagged image for registry: ${REGISTRY}/${APP_NAME}:${VERSION}"
    fi
    
    log_success "Build completed successfully"
}

# Push function
push_image() {
    if [ -z "$REGISTRY" ]; then
        log_error "DOCKER_REGISTRY environment variable not set"
        exit 1
    fi
    
    log_info "Pushing image to registry: ${REGISTRY}/${APP_NAME}:${VERSION}"
    docker push "${REGISTRY}/${APP_NAME}:${VERSION}"
    log_success "Push completed successfully"
}

# Deploy function
deploy_local() {
    log_info "Deploying locally with docker-compose"
    
    # Check if .env file exists
    if [ ! -f .env ]; then
        log_error ".env file not found. Creating template..."
        cat > .env << EOF
# OpenAI Configuration
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
REACT_APP_OPENAI_MODEL=gpt-4o
REACT_APP_OPENAI_TEMPERATURE=0.7
EOF
        log_error "Please update .env file with your API key and run again"
        exit 1
    fi
    
    docker-compose up -d
    log_success "Application deployed locally"
    log_info "Access the application at: http://localhost:3000"
    log_info "View logs with: docker-compose logs -f"
}

# Deploy production function
deploy_prod() {
    log_info "Deploying for production"
    
    # Check if API key is set
    if [ -z "$REACT_APP_OPENAI_API_KEY" ]; then
        log_error "REACT_APP_OPENAI_API_KEY environment variable not set"
        exit 1
    fi
    
    docker-compose -f docker-compose.prod.yml up -d
    log_success "Production deployment completed"
    log_info "Access the application at: http://localhost"
}

# Clean function
clean_up() {
    log_info "Cleaning up Docker images and containers"
    
    # Stop and remove containers
    docker-compose down --remove-orphans 2>/dev/null || true
    docker-compose -f docker-compose.prod.yml down --remove-orphans 2>/dev/null || true
    
    # Remove images
    docker rmi "${APP_NAME}:${VERSION}" 2>/dev/null || true
    if [ -n "$REGISTRY" ]; then
        docker rmi "${REGISTRY}/${APP_NAME}:${VERSION}" 2>/dev/null || true
    fi
    
    # Clean up dangling images
    docker image prune -f
    
    log_success "Cleanup completed"
}

# Health check function
health_check() {
    log_info "Performing health check"
    
    local retries=30
    local count=0
    
    while [ $count -lt $retries ]; do
        if curl -f http://localhost:3000/health >/dev/null 2>&1; then
            log_success "Application is healthy"
            return 0
        fi
        
        count=$((count + 1))
        log_info "Waiting for application to be ready... ($count/$retries)"
        sleep 2
    done
    
    log_error "Health check failed after $retries attempts"
    return 1
}

# Main execution
case "${2:-build}" in
    "build")
        build_image
        ;;
    "push")
        build_image
        push_image
        ;;
    "deploy")
        build_image
        deploy_local
        health_check
        ;;
    "deploy-prod")
        build_image
        deploy_prod
        health_check
        ;;
    "clean")
        clean_up
        ;;
    "help")
        show_help
        ;;
    *)
        log_error "Unknown command: ${2}"
        show_help
        exit 1
        ;;
esac
