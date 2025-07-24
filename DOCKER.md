# NHS Triage App - Docker Deployment Guide

This guide explains how to build and deploy the NHS Plastic Surgery Triage System using Docker.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- OpenAI API Key

## Quick Start

### 1. Environment Setup

Create a `.env` file in the project root:

```bash
# OpenAI Configuration
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
REACT_APP_OPENAI_MODEL=gpt-4o
REACT_APP_OPENAI_TEMPERATURE=0.7
```

### 2. Build and Run (Development)

```bash
# Build the Docker image
docker build -t nhs-triage-app .

# Run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down
```

The application will be available at `http://localhost:3000`

### 3. Production Deployment

```bash
# Use production compose file
docker-compose -f docker-compose.prod.yml up -d

# Scale the application
docker-compose -f docker-compose.prod.yml up -d --scale nhs-triage-app=3
```

## Docker Commands

### Building

```bash
# Build with specific tag
docker build -t nhs-triage-app:v1.0.0 .

# Build with build arguments
docker build --build-arg NODE_ENV=production -t nhs-triage-app .
```

### Running

```bash
# Run single container
docker run -d \
  --name nhs-triage \
  -p 3000:80 \
  -e REACT_APP_OPENAI_API_KEY=your_key \
  nhs-triage-app

# Run with volume for logs
docker run -d \
  --name nhs-triage \
  -p 3000:80 \
  -v $(pwd)/logs:/var/log/nginx \
  nhs-triage-app
```

### Management

```bash
# View running containers
docker ps

# View logs
docker logs nhs-triage

# Execute commands in container
docker exec -it nhs-triage /bin/sh

# Stop and remove
docker stop nhs-triage
docker rm nhs-triage
```

## Cloud Deployment

### AWS ECS (Elastic Container Service)

1. **Push to ECR:**
```bash
# Tag for ECR
docker tag nhs-triage-app:latest 123456789012.dkr.ecr.region.amazonaws.com/nhs-triage-app:latest

# Push to ECR
docker push 123456789012.dkr.ecr.region.amazonaws.com/nhs-triage-app:latest
```

2. **Create ECS Task Definition:**
```json
{
  "family": "nhs-triage-app",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "containerDefinitions": [
    {
      "name": "nhs-triage",
      "image": "123456789012.dkr.ecr.region.amazonaws.com/nhs-triage-app:latest",
      "portMappings": [
        {
          "containerPort": 80,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "REACT_APP_OPENAI_MODEL",
          "value": "gpt-4o"
        }
      ],
      "secrets": [
        {
          "name": "REACT_APP_OPENAI_API_KEY",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:openai-api-key"
        }
      ]
    }
  ]
}
```

### Google Cloud Run

```bash
# Build and push to Google Container Registry
docker tag nhs-triage-app gcr.io/your-project-id/nhs-triage-app
docker push gcr.io/your-project-id/nhs-triage-app

# Deploy to Cloud Run
gcloud run deploy nhs-triage-app \
  --image gcr.io/your-project-id/nhs-triage-app \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars REACT_APP_OPENAI_MODEL=gpt-4o \
  --set-secrets REACT_APP_OPENAI_API_KEY=openai-api-key:latest
```

### Azure Container Instances

```bash
# Create resource group
az group create --name nhs-triage-rg --location eastus

# Create container registry
az acr create --resource-group nhs-triage-rg --name nhstriageacr --sku Basic

# Build and push
az acr build --registry nhstriageacr --image nhs-triage-app .

# Deploy to ACI
az container create \
  --resource-group nhs-triage-rg \
  --name nhs-triage-app \
  --image nhstriageacr.azurecr.io/nhs-triage-app:latest \
  --cpu 1 \
  --memory 1 \
  --ports 80 \
  --environment-variables REACT_APP_OPENAI_MODEL=gpt-4o \
  --secure-environment-variables REACT_APP_OPENAI_API_KEY=your_key
```

### Kubernetes Deployment

```yaml
# kubernetes/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nhs-triage-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nhs-triage-app
  template:
    metadata:
      labels:
        app: nhs-triage-app
    spec:
      containers:
      - name: nhs-triage
        image: nhs-triage-app:latest
        ports:
        - containerPort: 80
        env:
        - name: REACT_APP_OPENAI_MODEL
          value: "gpt-4o"
        - name: REACT_APP_OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: openai-secret
              key: api-key
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: nhs-triage-service
spec:
  selector:
    app: nhs-triage-app
  ports:
  - port: 80
    targetPort: 80
  type: LoadBalancer
```

## Security Considerations

### Environment Variables
- Never include API keys in the Docker image
- Use Docker secrets or cloud provider secret management
- Rotate API keys regularly

### Network Security
- Use HTTPS in production
- Implement proper firewall rules
- Consider using a reverse proxy (nginx, Traefik)

### Container Security
- Run containers as non-root user
- Use specific image tags, not "latest"
- Regularly update base images
- Scan images for vulnerabilities

## Monitoring and Logging

### Health Checks
The container includes a health check endpoint at `/health`

### Logs
Application logs are available via:
```bash
docker logs nhs-triage-app
```

### Metrics
Consider adding monitoring tools:
- Prometheus + Grafana
- New Relic
- DataDog
- AWS CloudWatch

## Troubleshooting

### Common Issues

1. **Container won't start:**
   - Check logs: `docker logs container-name`
   - Verify environment variables
   - Check port conflicts

2. **API not working:**
   - Verify OpenAI API key is set correctly
   - Check network connectivity
   - Review CORS settings

3. **High memory usage:**
   - Adjust container memory limits
   - Check for memory leaks in application
   - Consider scaling horizontally

### Debug Mode
```bash
# Run container in debug mode
docker run -it --rm nhs-triage-app /bin/sh

# Check nginx configuration
docker exec -it nhs-triage nginx -t
```

## Best Practices

1. **Multi-stage builds** - Reduces image size
2. **Layer caching** - Optimize Dockerfile for better caching
3. **Security scanning** - Regularly scan images for vulnerabilities
4. **Resource limits** - Set appropriate CPU/memory limits
5. **Health checks** - Implement proper health check endpoints
6. **Graceful shutdown** - Handle SIGTERM signals properly

## Maintenance

### Updates
1. Update dependencies in package.json
2. Rebuild Docker image
3. Test in staging environment
4. Deploy to production with rolling update

### Backup
- Export container volumes if using persistent storage
- Backup configuration files
- Document deployment procedures
