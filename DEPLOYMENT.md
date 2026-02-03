# Deployment Guide

This guide covers various deployment options for the external platforms Toolkit application.

## Table of Contents

1. [Docker Hub Deployment](#docker-hub-deployment)
2. [Local Docker Deployment](#local-docker-deployment)
3. [Cloud Deployment Options](#cloud-deployment-options)
4. [Production Considerations](#production-considerations)

## Docker Hub Deployment

### Prerequisites

- Docker installed on your machine
- Docker Hub account ([Sign up here](https://hub.docker.com/signup))

### Step-by-Step Guide

#### 1. Build the Docker Image

Navigate to the project directory and build the image:

```bash
cd fgarola-tools
docker build -t fgarola-tools:latest .
```

This will create a production-ready Docker image with all dependencies included.

#### 2. Test the Image Locally

Before pushing to Docker Hub, test the image locally:

```bash
docker run -p 3000:3000 fgarola-tools:latest
```

Visit `http://localhost:3000` to verify everything works correctly.

#### 3. Tag the Image for Docker Hub

Replace `YOUR_USERNAME` with your Docker Hub username:

```bash
docker tag fgarola-tools:latest YOUR_USERNAME/fgarola-tools:latest
docker tag fgarola-tools:latest YOUR_USERNAME/fgarola-tools:v1.0.0
```

#### 4. Login to Docker Hub

```bash
docker login
```

Enter your Docker Hub credentials when prompted.

#### 5. Push to Docker Hub

```bash
docker push YOUR_USERNAME/fgarola-tools:latest
docker push YOUR_USERNAME/fgarola-tools:v1.0.0
```

#### 6. Verify on Docker Hub

Visit `https://hub.docker.com/r/YOUR_USERNAME/fgarola-tools` to see your published image.

### Using the Published Image

Anyone can now pull and run your image:

```bash
# Pull the image
docker pull YOUR_USERNAME/fgarola-tools:latest

# Run the container
docker run -d -p 3000:3000 --name fgarola-tools YOUR_USERNAME/fgarola-tools:latest
```

## Local Docker Deployment

### Using Docker Compose (Recommended)

1. **Start the application:**
   ```bash
   docker-compose up -d
   ```

2. **View logs:**
   ```bash
   docker-compose logs -f
   ```

3. **Stop the application:**
   ```bash
   docker-compose down
   ```

### Using Docker CLI

1. **Build:**
   ```bash
   docker build -t fgarola-tools .
   ```

2. **Run:**
   ```bash
   docker run -d \
     -p 3000:3000 \
     --name fgarola-tools \
     --restart unless-stopped \
     fgarola-tools
   ```

3. **Stop:**
   ```bash
   docker stop fgarola-tools
   docker rm fgarola-tools
   ```

## Cloud Deployment Options

### 1. AWS ECS (Elastic Container Service)

```bash
# Install AWS CLI and configure credentials
aws configure

# Create ECR repository
aws ecr create-repository --repository-name fgarola-tools

# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Tag and push
docker tag fgarola-tools:latest YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/fgarola-tools:latest
docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/fgarola-tools:latest

# Deploy using ECS console or CLI
```

### 2. Google Cloud Run

```bash
# Install gcloud CLI and authenticate
gcloud auth login

# Set project
gcloud config set project YOUR_PROJECT_ID

# Build and push to Google Container Registry
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/fgarola-tools

# Deploy to Cloud Run
gcloud run deploy fgarola-tools \
  --image gcr.io/YOUR_PROJECT_ID/fgarola-tools \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3000
```

### 3. Azure Container Instances

```bash
# Login to Azure
az login

# Create resource group
az group create --name fgarola-tools-rg --location eastus

# Create container registry
az acr create --resource-group fgarola-tools-rg --name fgarolaacr --sku Basic

# Login to ACR
az acr login --name fgarolaacr

# Tag and push
docker tag fgarola-tools:latest fgarolaacr.azurecr.io/fgarola-tools:latest
docker push fgarolaacr.azurecr.io/fgarola-tools:latest

# Deploy container
az container create \
  --resource-group fgarola-tools-rg \
  --name fgarola-tools \
  --image fgarolaacr.azurecr.io/fgarola-tools:latest \
  --dns-name-label fgarola-tools-unique \
  --ports 3000
```

### 4. DigitalOcean App Platform

1. Push your image to Docker Hub (see above)
2. Go to DigitalOcean App Platform
3. Create new app from Docker Hub
4. Select your image: `YOUR_USERNAME/fgarola-tools:latest`
5. Configure port: 3000
6. Deploy

### 5. Railway

1. Install Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

2. Login and deploy:
   ```bash
   railway login
   railway init
   railway up
   ```

### 6. Render

1. Push code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Create new Web Service
4. Connect your GitHub repository
5. Select "Docker" as environment
6. Deploy

## Production Considerations

### 1. Environment Variables

Create a `.env` file for production:

```env
NODE_ENV=production
PORT=3000
```

### 2. Resource Limits

Set appropriate resource limits in docker-compose.yml:

```yaml
services:
  fgarola-tools:
    # ... other config
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

### 3. Health Checks

Add health check to Dockerfile:

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"
```

### 4. Logging

Configure logging driver in docker-compose.yml:

```yaml
services:
  fgarola-tools:
    # ... other config
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

### 5. Reverse Proxy (Nginx)

Example nginx configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 6. SSL/TLS

Use Let's Encrypt with Certbot:

```bash
sudo certbot --nginx -d yourdomain.com
```

### 7. Monitoring

Consider adding monitoring tools:
- **Prometheus** for metrics
- **Grafana** for visualization
- **Sentry** for error tracking

### 8. Backup Strategy

Regularly backup:
- Application configuration
- Environment variables
- Docker volumes (if any)

### 9. Security Best Practices

- Keep Docker images updated
- Use non-root user (already configured)
- Implement rate limiting
- Add CORS configuration if needed
- Regular security audits

### 10. Scaling

For high traffic, consider:
- Load balancing with multiple containers
- Kubernetes for orchestration
- CDN for static assets
- Caching layer (Redis)

## Troubleshooting

### Container won't start
```bash
# Check logs
docker logs fgarola-tools

# Check container status
docker ps -a
```

### Port already in use
```bash
# Find process using port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Use different port
docker run -p 8080:3000 fgarola-tools
```

### Out of memory
```bash
# Increase Docker memory limit
# Docker Desktop: Settings > Resources > Memory

# Or set container memory limit
docker run -m 1g fgarola-tools
```

## Support

For issues and questions:
- Check the main [README.md](README.md)
- Review Docker logs
- Check GitHub issues
- Contact support

## Updates

To update the deployed application:

1. Pull latest changes
2. Rebuild image
3. Push to registry
4. Restart container

```bash
git pull
docker build -t YOUR_USERNAME/fgarola-tools:latest .
docker push YOUR_USERNAME/fgarola-tools:latest
docker-compose down
docker-compose pull
docker-compose up -d
```

