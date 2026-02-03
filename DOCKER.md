# 🐳 Docker Deployment Guide

Complete guide for building, running, and deploying the external platforms Toolkit application using Docker.

---

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Building the Image](#building-the-image)
- [Running the Container](#running-the-container)
- [Pushing to DockerHub](#pushing-to-dockerhub)
- [Docker Compose](#docker-compose)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

---

## 🔧 Prerequisites

### Required Software

1. **Docker Desktop** (Windows/Mac) or **Docker Engine** (Linux)
   - Process: https://www.docker.com/products/docker-desktop
   - Minimum version: 20.10+

2. **DockerHub Account** (for pushing images)
   - Sign up: https://hub.docker.com/signup

### System Requirements

- **RAM**: 4GB minimum, 8GB recommended
- **Disk Space**: 2GB for image + dependencies
- **OS**: Windows 10/11, macOS 10.15+, or Linux

---

## 🚀 Quick Start

### Option 1: Pull from DockerHub (Recommended)

```bash
# Pull the latest image
docker pull ferrylinxx/fgarola-tools:latest

# Run the container
docker run -d \
  --name fgarola-tools \
  -p 3000:3000 \
  --restart unless-stopped \
  ferrylinxx/fgarola-tools:latest

# Access at http://localhost:3000
```

### Option 2: Build Locally

**Linux/Mac:**
```bash
chmod +x docker-build.sh
./docker-build.sh
```

**Windows (PowerShell):**
```powershell
.\docker-build.ps1
```

---

## 🏗️ Building the Image

### Automated Build (Recommended)

The build scripts automatically:
- ✅ Install all Node.js dependencies
- ✅ Install yt-dlp and ffmpeg
- ✅ Build Next.js application
- ✅ Create optimized production image
- ✅ Verify installations

**Linux/Mac:**
```bash
./docker-build.sh
```

**Windows:**
```powershell
.\docker-build.ps1
```

### Manual Build

```bash
docker build -t ferrylinxx/fgarola-tools:2.2.0 .
docker tag ferrylinxx/fgarola-tools:2.2.0 ferrylinxx/fgarola-tools:latest
```

### Build Arguments

```bash
docker build \
  --build-arg NODE_ENV=production \
  --tag ferrylinxx/fgarola-tools:latest \
  .
```

---

## 🏃 Running the Container

### Basic Run

```bash
docker run -d \
  --name fgarola-tools \
  -p 3000:3000 \
  ferrylinxx/fgarola-tools:latest
```

### With Custom Port

```bash
docker run -d \
  --name fgarola-tools \
  -p 8080:3000 \
  -e PORT=3000 \
  ferrylinxx/fgarola-tools:latest
```

### With Volume Mount (Persistent Processed files)

```bash
docker run -d \
  --name fgarola-tools \
  -p 3000:3000 \
  -v $(pwd)/temp:/app/temp \
  ferrylinxx/fgarola-tools:latest
```

### With Auto-Restart

```bash
docker run -d \
  --name fgarola-tools \
  -p 3000:3000 \
  --restart unless-stopped \
  ferrylinxx/fgarola-tools:latest
```

---

## 📤 Pushing to DockerHub

### Automated Push (Recommended)

**Linux/Mac:**
```bash
chmod +x docker-push.sh
./docker-push.sh
```

**Windows:**
```powershell
.\docker-push.ps1
```

### Manual Push

1. **Login to DockerHub:**
```bash
docker login
```

2. **Tag the image:**
```bash
docker tag fgarola-tools:latest ferrylinxx/fgarola-tools:2.2.0
docker tag fgarola-tools:latest ferrylinxx/fgarola-tools:latest
```

3. **Push the images:**
```bash
docker push ferrylinxx/fgarola-tools:2.2.0
docker push ferrylinxx/fgarola-tools:latest
```

---

## 🐙 Docker Compose

### Using Docker Compose

```bash
# Start the application
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down

# Rebuild and restart
docker-compose up -d --build
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  fgarola-tools:
    image: ferrylinxx/fgarola-tools:latest
    container_name: fgarola-tools
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    volumes:
      - ./temp:/app/temp
    restart: unless-stopped
```

---

## 🔐 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `production` | Node.js environment |
| `PORT` | `3000` | Application port |
| `HOSTNAME` | `0.0.0.0` | Bind address |
| `NEXT_TELEMETRY_DISABLED` | `1` | Disable Next.js telemetry |

### Setting Environment Variables

```bash
docker run -d \
  --name fgarola-tools \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  ferrylinxx/fgarola-tools:latest
```

---

## 🛠️ Container Management

### View Logs

```bash
# Follow logs
docker logs -f fgarola-tools

# Last 100 lines
docker logs --tail 100 fgarola-tools
```

### Stop Container

```bash
docker stop fgarola-tools
```

### Start Container

```bash
docker start fgarola-tools
```

### Restart Container

```bash
docker restart fgarola-tools
```

### Remove Container

```bash
docker stop fgarola-tools
docker rm fgarola-tools
```

### Execute Commands Inside Container

```bash
# Open shell
docker exec -it fgarola-tools sh

# Check yt-dlp version
docker exec fgarola-tools yt-dlp --version

# Check ffmpeg version
docker exec fgarola-tools ffmpeg -version
```

---

## 🔍 Health Check

The container includes a built-in health check:

```bash
# Check container health
docker inspect --format='{{.State.Health.Status}}' fgarola-tools

# View health check logs
docker inspect --format='{{json .State.Health}}' fgarola-tools | jq
```

Health check runs every 30 seconds and checks if the application responds at `http://localhost:3000/`.

---

## 🐛 Troubleshooting

### Container Won't Start

```bash
# Check logs
docker logs fgarola-tools

# Check if port is already in use
netstat -an | grep 3000  # Linux/Mac
netstat -an | findstr 3000  # Windows
```

### yt-dlp Not Working

```bash
# Verify yt-dlp is installed
docker exec fgarola-tools yt-dlp --version

# Update yt-dlp
docker exec fgarola-tools pip3 install --upgrade yt-dlp
```

### Permission Issues

```bash
# Check file permissions
docker exec fgarola-tools ls -la /app/temp

# Fix permissions
docker exec fgarola-tools chown -R nextjs:nodejs /app/temp
```

### Image Too Large

The image is optimized using multi-stage builds. Current size: ~500MB

To reduce further:
- Remove unused dependencies
- Use alpine-based images
- Clean npm cache

### Connection Refused

```bash
# Check if container is running
docker ps | grep fgarola-tools

# Check port mapping
docker port fgarola-tools

# Check firewall settings
```

---

## 📊 Image Information

### Image Layers

```bash
# View image history
docker history ferrylinxx/fgarola-tools:latest

# Inspect image
docker inspect ferrylinxx/fgarola-tools:latest
```

### Image Size

```bash
# Check image size
docker images ferrylinxx/fgarola-tools:latest
```

---

## 🔄 Updating

### Pull Latest Version

```bash
# Pull latest image
docker pull ferrylinxx/fgarola-tools:latest

# Stop and remove old container
docker stop fgarola-tools
docker rm fgarola-tools

# Run new container
docker run -d \
  --name fgarola-tools \
  -p 3000:3000 \
  --restart unless-stopped \
  ferrylinxx/fgarola-tools:latest
```

---

## 📝 Notes

- The container runs as a non-root user (`nextjs`) for security
- Temporary files are stored in `/app/temp` and cleaned up automatically
- The application uses standalone Next.js output for optimal performance
- Health checks ensure the container is always responsive

---

## 🆘 Support

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. View container logs: `docker logs fgarola-tools`
3. Open an issue on GitHub
4. Check DockerHub page: https://hub.docker.com/r/ferrylinxx/fgarola-tools

---

## 📜 License

MIT License - See LICENSE file for details

