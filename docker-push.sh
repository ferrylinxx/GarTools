#!/bin/bash

# GarTools - Docker Push Script
# This script pushes the Docker image to DockerHub

set -e  # Exit on error

echo "🐳 GarTools - Docker Push Script"
echo "=========================================="
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

# Check if image exists
if ! docker images ${FULL_IMAGE_NAME}:${VERSION} --format "{{.Repository}}" | grep -q "${FULL_IMAGE_NAME}"; then
    print_error "Image ${FULL_IMAGE_NAME}:${VERSION} not found!"
    print_info "Please build the image first using: ./docker-build.sh"
    exit 1
fi

print_success "Image found: ${FULL_IMAGE_NAME}:${VERSION}"
echo ""

# Check if user is logged in to DockerHub
print_info "Checking DockerHub login status..."
if ! docker info 2>/dev/null | grep -q "Username"; then
    print_warning "Not logged in to DockerHub"
    print_info "Logging in to DockerHub..."
    docker login
    
    if [ $? -ne 0 ]; then
        print_error "DockerHub login failed!"
        exit 1
    fi
fi

print_success "Logged in to DockerHub"
echo ""

# Push the images
print_info "Pushing ${FULL_IMAGE_NAME}:${VERSION}..."
docker push ${FULL_IMAGE_NAME}:${VERSION}

if [ $? -eq 0 ]; then
    print_success "Successfully pushed ${FULL_IMAGE_NAME}:${VERSION}"
else
    print_error "Failed to push ${FULL_IMAGE_NAME}:${VERSION}"
    exit 1
fi

echo ""
print_info "Pushing ${FULL_IMAGE_NAME}:latest..."
docker push ${FULL_IMAGE_NAME}:latest

if [ $? -eq 0 ]; then
    print_success "Successfully pushed ${FULL_IMAGE_NAME}:latest"
else
    print_error "Failed to push ${FULL_IMAGE_NAME}:latest"
    exit 1
fi

echo ""
print_success "All images pushed successfully!"
echo ""
print_info "Your image is now available at:"
echo "  🐳 https://hub.docker.com/r/${DOCKERHUB_USERNAME}/${IMAGE_NAME}"
echo ""
print_info "Users can pull your image with:"
echo "  docker pull ${FULL_IMAGE_NAME}:latest"
echo "  docker pull ${FULL_IMAGE_NAME}:${VERSION}"
echo ""
print_info "Or run directly with:"
echo "  docker run -d -p 3000:3000 ${FULL_IMAGE_NAME}:latest"

