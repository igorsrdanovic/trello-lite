# Docker Setup Guide

Complete guide for running Trello Lite with Docker.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Development Mode](#development-mode)
- [Production Mode](#production-mode)
- [Using Makefile](#using-makefile)
- [Environment Variables](#environment-variables)
- [Advanced Configuration](#advanced-configuration)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- Docker 20.10+
- Docker Compose 2.0+
- (Optional) Make for using Makefile commands

### Check Prerequisites

```bash
docker --version
docker-compose --version
make --version  # Optional
```

## Quick Start

### Production (Recommended for deployment)

```bash
# Using Docker Compose
docker-compose up -d

# Or using Makefile
make up
```

Access the application at: **http://localhost**

### Development (With hot-reload)

```bash
# Using Docker Compose
docker-compose -f docker-compose.dev.yml up -d

# Or using Makefile
make up-dev
```

Access the application at: **http://localhost:5173**

## Development Mode

Development mode includes:
- ✅ Hot-reload on code changes
- ✅ Source maps for debugging
- ✅ Volume mounts for live code updates
- ✅ TypeScript compilation in watch mode

### Start Development Server

```bash
# Method 1: Docker Compose
docker-compose -f docker-compose.dev.yml up

# Method 2: Makefile (recommended)
make up-dev

# Method 3: Manual Docker build
docker build -f Dockerfile.dev -t trello-lite-dev .
docker run -p 5173:5173 -v $(pwd)/src:/app/src trello-lite-dev
```

### View Development Logs

```bash
# Follow logs
docker-compose -f docker-compose.dev.yml logs -f

# Or using Makefile
make logs-dev
```

### Stop Development Server

```bash
docker-compose -f docker-compose.dev.yml down

# Or using Makefile
make down-dev
```

## Production Mode

Production mode includes:
- ✅ Multi-stage Docker build for smaller image
- ✅ Nginx web server with optimized configuration
- ✅ Gzip compression
- ✅ Caching headers for static assets
- ✅ Security headers
- ✅ Health check endpoint

### Build Production Image

```bash
# Method 1: Docker Compose
docker-compose build

# Method 2: Makefile
make build

# Method 3: Manual Docker build
docker build -t trello-lite .
```

### Start Production Server

```bash
# Start in detached mode
docker-compose up -d

# Or using Makefile
make up

# Start with logs
docker-compose up
```

### View Production Logs

```bash
docker-compose logs -f

# Or using Makefile
make logs
```

### Stop Production Server

```bash
docker-compose down

# Or using Makefile
make down
```

## Using Makefile

The Makefile provides convenient shortcuts for common Docker operations.

### Available Commands

```bash
make help              # Show all available commands

# Building
make build            # Build production image
make build-dev        # Build development image

# Running
make up               # Start production container
make up-dev           # Start development container

# Stopping
make down             # Stop production container
make down-dev         # Stop development container

# Logs
make logs             # View production logs
make logs-dev         # View development logs

# Shell Access
make shell            # Open shell in production container
make shell-dev        # Open shell in development container

# Maintenance
make clean            # Remove all containers and images
make rebuild          # Rebuild production from scratch
make rebuild-dev      # Rebuild development from scratch

# Status
make ps               # Show running containers
make health           # Check container health
```

### Examples

```bash
# Quick production deployment
make build && make up

# Development workflow
make build-dev && make up-dev && make logs-dev

# Rebuild everything from scratch
make clean && make rebuild

# Check if everything is running
make ps
make health
```

## Environment Variables

### Supported Variables

Create a `.env` file in the project root:

```env
# Port Configuration
PROD_PORT=80
DEV_PORT=5173

# Node Environment
NODE_ENV=production

# API Configuration (if using backend)
# API_URL=https://api.example.com
```

### Using with Docker Compose

```yaml
# docker-compose.yml
services:
  trello-lite:
    ports:
      - "${PROD_PORT:-80}:80"
    environment:
      - NODE_ENV=${NODE_ENV:-production}
```

## Advanced Configuration

### Custom Port Mapping

**Production:**
```bash
# Run on custom port (e.g., 8080)
docker run -p 8080:80 trello-lite
```

**Development:**
```bash
# Run dev server on custom port
docker run -p 3000:5173 trello-lite-dev
```

### Volume Mounts for Data Persistence

If you want to persist localStorage data (optional):

```yaml
# docker-compose.yml
services:
  trello-lite:
    volumes:
      - trello-data:/usr/share/nginx/html/data

volumes:
  trello-data:
```

### Custom Nginx Configuration

Edit `nginx.conf` and rebuild:

```bash
# Edit nginx.conf
vim nginx.conf

# Rebuild
docker-compose build --no-cache
docker-compose up -d
```

### Multi-Platform Build

Build for multiple architectures:

```bash
# Build for ARM64 and AMD64
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t trello-lite:latest \
  --push \
  .
```

## Docker Images

### Image Sizes

- **Production**: ~50MB (Alpine + Nginx + built app)
- **Development**: ~400MB (Node + dependencies)

### Reduce Production Image Size

The production Dockerfile uses:
- Multi-stage build
- Alpine Linux (minimal base)
- Only production dependencies in final image
- Nginx for serving static files

### Registry Push

```bash
# Tag image
docker tag trello-lite:latest myregistry/trello-lite:latest

# Push to registry
docker push myregistry/trello-lite:latest
```

## Health Checks

### Built-in Health Check

The production container includes a health check:

```bash
# Check health status
docker inspect --format='{{.State.Health.Status}}' trello-lite-prod

# View health check logs
docker inspect --format='{{json .State.Health}}' trello-lite-prod | jq
```

### Manual Health Check

```bash
# HTTP health check
curl http://localhost/health

# Should return: "healthy"
```

## Networking

### Default Network

Containers use the `trello-network` bridge network.

### Connecting Multiple Containers

```yaml
# docker-compose.yml
services:
  trello-lite:
    networks:
      - trello-network

  backend-api:
    networks:
      - trello-network

networks:
  trello-network:
    driver: bridge
```

### Expose to Host Network

```bash
# Use host network mode
docker run --network host trello-lite
```

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker-compose logs trello-lite

# Check container status
docker ps -a

# Inspect container
docker inspect trello-lite-prod
```

### Port Already in Use

```bash
# Find process using port 80
sudo lsof -i :80

# Or use different port
docker-compose up -d -p 8080:80
```

### Build Failures

```bash
# Clean build cache
docker builder prune

# Rebuild without cache
docker-compose build --no-cache

# Check Docker disk space
docker system df
```

### Permission Issues

```bash
# Fix ownership of volumes
docker-compose down
sudo chown -R $USER:$USER .
docker-compose up -d
```

### Hot-Reload Not Working (Dev)

```bash
# Ensure volumes are mounted correctly
docker-compose -f docker-compose.dev.yml config

# Restart development container
make down-dev && make up-dev
```

### Image Too Large

```bash
# Check image size
docker images trello-lite

# Use multi-stage build (already configured)
# Check .dockerignore is working
cat .dockerignore
```

### Memory Issues

```bash
# Limit container memory
docker run -m 512m trello-lite

# Or in docker-compose.yml:
services:
  trello-lite:
    mem_limit: 512m
```

## Security Best Practices

### 1. Run as Non-Root User

```dockerfile
# Add to Dockerfile
RUN addgroup -g 1001 -S appuser && \
    adduser -u 1001 -S appuser -G appuser
USER appuser
```

### 2. Scan for Vulnerabilities

```bash
# Scan image
docker scan trello-lite

# Or use Trivy
trivy image trello-lite
```

### 3. Use Secrets for Sensitive Data

```bash
# Use Docker secrets instead of environment variables
echo "secret_value" | docker secret create my_secret -
```

### 4. Keep Base Images Updated

```bash
# Pull latest base images
docker pull node:20-alpine
docker pull nginx:alpine

# Rebuild
make rebuild
```

## Performance Optimization

### Enable BuildKit

```bash
# Enable BuildKit for faster builds
export DOCKER_BUILDKIT=1
docker-compose build
```

### Use Layer Caching

The Dockerfile is optimized for layer caching:
1. Copy `package.json` first
2. Install dependencies
3. Copy source code
4. Build application

### Prune Unused Resources

```bash
# Remove unused images, containers, networks
docker system prune -a

# Remove all volumes (careful!)
docker volume prune
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Docker Build

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Build Docker image
        run: docker build -t trello-lite .

      - name: Run tests
        run: docker run trello-lite npm test

      - name: Push to registry
        run: |
          docker tag trello-lite ${{ secrets.REGISTRY }}/trello-lite:latest
          docker push ${{ secrets.REGISTRY }}/trello-lite:latest
```

## Production Deployment

### Docker Swarm

```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml trello-lite

# Check services
docker service ls
```

### Kubernetes

```bash
# Generate Kubernetes manifests
kompose convert -f docker-compose.yml

# Deploy to Kubernetes
kubectl apply -f .
```

### Cloud Platforms

- **AWS ECS**: Use the Dockerfile with ECS task definitions
- **Google Cloud Run**: Compatible with Cloud Run deployments
- **Azure Container Instances**: Deploy using Azure CLI
- **DigitalOcean App Platform**: Use Dockerfile for deployment

## Backup and Restore

### Backup Container Data

```bash
# Backup volumes
docker run --rm \
  -v trello_data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/trello-backup.tar.gz /data
```

### Restore Container Data

```bash
# Restore volumes
docker run --rm \
  -v trello_data:/data \
  -v $(pwd):/backup \
  alpine tar xzf /backup/trello-backup.tar.gz -C /
```

## Monitoring

### View Resource Usage

```bash
# Real-time stats
docker stats trello-lite-prod

# Container top
docker top trello-lite-prod
```

### Logs Management

```bash
# Limit log size in docker-compose.yml
services:
  trello-lite:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

## Support

For issues with Docker setup:
1. Check this documentation
2. Review logs: `make logs` or `make logs-dev`
3. Open an issue on GitHub
4. Join our community discussions

---

**Happy Dockerizing! 🐳**
