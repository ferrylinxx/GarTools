# Docker Hub Publishing Guide

Complete step-by-step guide to publish your external platforms Toolkit to Docker Hub.

## Prerequisites

1. **Docker Hub Account**
   - Sign up at [hub.docker.com](https://hub.docker.com/signup)
   - Verify your email address
   - Remember your username

2. **Docker Installed**
   - Verify: `docker --version`
   - Should show Docker version 20.10 or higher

3. **Project Built Successfully**
   - Ensure `npm run build` completes without errors

## Step-by-Step Publishing Process

### Step 1: Prepare Your Image

Navigate to the project directory:
```bash
cd fgarola-tools
```

### Step 2: Build the Docker Image

Build the image with your Docker Hub username:

```bash
docker build -t YOUR_DOCKERHUB_USERNAME/fgarola-tools:latest .
```

**Example:**
```bash
docker build -t johndoe/fgarola-tools:latest .
```

This will take 5-10 minutes depending on your internet speed.

**Expected output:**
```
[+] Building 300.5s (15/15) FINISHED
 => [internal] load build definition from Dockerfile
 => => transferring dockerfile: 1.23kB
 => [internal] load .dockerignore
 ...
 => => naming to docker.io/johndoe/fgarola-tools:latest
```

### Step 3: Test the Image Locally

Before publishing, test that the image works:

```bash
docker run -p 3000:3000 YOUR_DOCKERHUB_USERNAME/fgarola-tools:latest
```

Open `http://localhost:3000` in your browser and test:
- ✅ Page loads correctly
- ✅ Can enter external platforms URL
- ✅ Can select format (MP3/MP4)
- ✅ Process button works

Press `Ctrl+C` to stop the container.

### Step 4: Tag Your Image (Optional but Recommended)

Create version tags for better version management:

```bash
# Tag with version number
docker tag YOUR_DOCKERHUB_USERNAME/fgarola-tools:latest YOUR_DOCKERHUB_USERNAME/fgarola-tools:v1.0.0

# Tag with 'stable' for production-ready versions
docker tag YOUR_DOCKERHUB_USERNAME/fgarola-tools:latest YOUR_DOCKERHUB_USERNAME/fgarola-tools:stable
```

**Example:**
```bash
docker tag johndoe/fgarola-tools:latest johndoe/fgarola-tools:v1.0.0
docker tag johndoe/fgarola-tools:latest johndoe/fgarola-tools:stable
```

### Step 5: Login to Docker Hub

```bash
docker login
```

Enter your credentials:
```
Username: YOUR_DOCKERHUB_USERNAME
Password: YOUR_DOCKERHUB_PASSWORD
```

**Successful login:**
```
Login Succeeded
```

**Troubleshooting login issues:**
- Use your Docker Hub username, not email
- If using 2FA, create an access token at [hub.docker.com/settings/security](https://hub.docker.com/settings/security)
- Use the access token as your password

### Step 6: Push to Docker Hub

Push all your tagged images:

```bash
# Push latest tag
docker push YOUR_DOCKERHUB_USERNAME/fgarola-tools:latest

# Push version tag
docker push YOUR_DOCKERHUB_USERNAME/fgarola-tools:v1.0.0

# Push stable tag
docker push YOUR_DOCKERHUB_USERNAME/fgarola-tools:stable
```

**Example:**
```bash
docker push johndoe/fgarola-tools:latest
docker push johndoe/fgarola-tools:v1.0.0
docker push johndoe/fgarola-tools:stable
```

**Expected output:**
```
The push refers to repository [docker.io/johndoe/fgarola-tools]
5f70bf18a086: Pushed
latest: digest: sha256:abc123... size: 1234
```

This will take 5-15 minutes depending on your upload speed.

### Step 7: Verify on Docker Hub

1. Go to [hub.docker.com](https://hub.docker.com)
2. Login to your account
3. Navigate to your repositories
4. You should see `fgarola-tools`
5. Click on it to view details

### Step 8: Update Repository Information (Recommended)

On Docker Hub, add:

**Short Description:**
```
external platforms video toolkit - Process videos as MP3 or MP4. Built with Next.js and Docker.
```

**Full Description:**
```markdown
# external platforms Toolkit

A modern web application for processing external platforms videos as MP3 (audio) or MP4 (video) files.

## Features
- Process external platforms videos in MP4 format
- Extract audio and convert to MP3
- Modern, responsive UI with dark mode
- Production-ready with Docker

## Quick Start

docker pull YOUR_USERNAME/fgarola-tools:latest
docker run -p 3000:3000 YOUR_USERNAME/fgarola-tools:latest

Then open http://localhost:3000

## Documentation
Full documentation available at: [GitHub Repository URL]

## Legal Notice
For personal use only. Respect external platforms's Terms of Service and copyright laws.
```

## Using Your Published Image

### Pull the Image

Anyone can now pull your image:

```bash
docker pull YOUR_DOCKERHUB_USERNAME/fgarola-tools:latest
```

### Run the Container

```bash
docker run -d -p 3000:3000 --name fgarola-tools YOUR_DOCKERHUB_USERNAME/fgarola-tools:latest
```

### With Docker Compose

Create a `docker-compose.yml`:

```yaml
version: '3.8'

services:
  fgarola-tools:
    image: YOUR_DOCKERHUB_USERNAME/fgarola-tools:latest
    ports:
      - "3000:3000"
    restart: unless-stopped
```

Run:
```bash
docker-compose up -d
```

## Updating Your Image

When you make changes to the application:

### 1. Rebuild the Image

```bash
docker build -t YOUR_DOCKERHUB_USERNAME/fgarola-tools:latest .
```

### 2. Tag New Version

```bash
docker tag YOUR_DOCKERHUB_USERNAME/fgarola-tools:latest YOUR_DOCKERHUB_USERNAME/fgarola-tools:v1.1.0
```

### 3. Push Updates

```bash
docker push YOUR_DOCKERHUB_USERNAME/fgarola-tools:latest
docker push YOUR_DOCKERHUB_USERNAME/fgarola-tools:v1.1.0
```

### 4. Update Users

Users can pull the latest version:
```bash
docker pull YOUR_DOCKERHUB_USERNAME/fgarola-tools:latest
docker-compose down
docker-compose up -d
```

## Best Practices

### 1. Version Tagging Strategy

```bash
# Always tag with semantic versioning
v1.0.0  # Major.Minor.Patch
v1.1.0  # New features
v1.1.1  # Bug fixes

# Use descriptive tags
latest  # Most recent build
stable  # Production-ready
dev     # Development version
```

### 2. Image Size Optimization

Current image size: ~500MB

To check size:
```bash
docker images YOUR_DOCKERHUB_USERNAME/fgarola-tools
```

### 3. Security Scanning

Scan for vulnerabilities:
```bash
docker scan YOUR_DOCKERHUB_USERNAME/fgarola-tools:latest
```

### 4. Automated Builds

Set up automated builds on Docker Hub:
1. Link your GitHub repository
2. Configure build rules
3. Automatic builds on git push

## Sharing Your Image

### Share Command

```bash
docker pull YOUR_DOCKERHUB_USERNAME/fgarola-tools:latest
docker run -p 3000:3000 YOUR_DOCKERHUB_USERNAME/fgarola-tools:latest
```

### Share URL

```
https://hub.docker.com/r/YOUR_DOCKERHUB_USERNAME/fgarola-tools
```

### README Badge

Add to your GitHub README:

```markdown
[![Docker Pulls](https://img.shields.io/docker/pulls/YOUR_DOCKERHUB_USERNAME/fgarola-tools)](https://hub.docker.com/r/YOUR_DOCKERHUB_USERNAME/fgarola-tools)
```

## Troubleshooting

### Build Fails

```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker build --no-cache -t YOUR_DOCKERHUB_USERNAME/fgarola-tools:latest .
```

### Push Fails

```bash
# Re-login
docker logout
docker login

# Check image name
docker images | grep fgarola-tools
```

### Image Too Large

```bash
# Check layer sizes
docker history YOUR_DOCKERHUB_USERNAME/fgarola-tools:latest

# Use multi-stage builds (already implemented)
# Remove unnecessary files in .dockerignore
```

## Support

For issues:
- Check Docker Hub repository page
- Review build logs
- Check GitHub issues
- Contact support

## Next Steps

1. ✅ Image published to Docker Hub
2. 📝 Update GitHub README with Docker Hub link
3. 🔄 Set up automated builds (optional)
4. 📊 Monitor pull statistics
5. 🚀 Deploy to cloud platforms

Congratulations! Your external platforms Toolkit is now available on Docker Hub! 🎉

