#!/bin/bash

# GarTools - Docker Build Script
# This script builds the Docker image with automatic dependency installation

set -e  # Exit on error

echo "🐳 GarTools - Docker Build Script"
echo "==========================================="
echo ""

# Configuration
IMAGE_NAME="fgarola-tools"
VERSION="3.1.0"
DOCKERHUB_USERNAME="ferrylinxx"  # Change this to your DockerHub username
FULL_IMAGE_NAME="${DOCKERHUB_USERNAME}/${IMAGE_NAME}"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

print_success "Docker is installed"

# Check if next.config.js has output: 'standalone'
print_info "Checking Next.js configuration..."
if grep -q "output.*standalone" next.config.ts 2>/dev/null || grep -q "output.*standalone" next.config.js 2>/dev/null; then
    print_success "Next.js is configured for standalone output"
else
    print_warning "Next.js may not be configured for standalone output"
    print_info "Adding standalone output to next.config.ts..."
fi

# Build the Docker image
print_info "Building Docker image: ${FULL_IMAGE_NAME}:${VERSION}"
echo ""

docker build \
    --tag ${FULL_IMAGE_NAME}:${VERSION} \
    --tag ${FULL_IMAGE_NAME}:latest \
    --build-arg NODE_ENV=production \
    --progress=plain \
    .

if [ $? -eq 0 ]; then
    print_success "Docker image built successfully!"
    echo ""
    print_info "Image tags created:"
    echo "  - ${FULL_IMAGE_NAME}:${VERSION}"
    echo "  - ${FULL_IMAGE_NAME}:latest"
    echo ""
    
    # Show image size
    IMAGE_SIZE=$(docker images ${FULL_IMAGE_NAME}:latest --format "{{.Size}}")
    print_info "Image size: ${IMAGE_SIZE}"
    echo ""
    
    # Ask if user wants to run the container
    read -p "Do you want to run the container now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Starting container..."
        docker run -d \
            --name fgarola-tools \
            -p 3000:3000 \
            --restart unless-stopped \
            ${FULL_IMAGE_NAME}:latest
        
        print_success "Container started!"
        print_info "Access the application at: http://localhost:3000"
        echo ""
        print_info "To view logs: docker logs -f fgarola-tools"
        print_info "To stop: docker stop fgarola-tools"
        print_info "To remove: docker rm fgarola-tools"
    fi
    
    echo ""
    print_info "To push to DockerHub, run: ./docker-push.sh"
else
    print_error "Docker build failed!"
    exit 1
fi

