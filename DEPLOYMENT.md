# Docker Deployment Scripts

## Quick Start Commands

### For Windows (PowerShell)
```powershell
# Build and run development environment
.\build-deploy.ps1 -Mode dev

# Build and run production environment
.\build-deploy.ps1 -Mode prod

# Clean all containers and images
.\build-deploy.ps1 -Mode clean
```

### For Linux/Mac (Bash)
```bash
# Build and run development environment
./build-deploy.sh dev

# Build and run production environment
./build-deploy.sh prod

# Clean all containers and images
./build-deploy.sh clean
```

## Manual Docker Commands

### Development Environment
```bash
# Build the image
docker build -t nhs-triage-app:dev .

# Run development environment
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Environment
```bash
# Build production image
docker build -t nhs-triage-app:prod .

# Run production environment
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop services
docker-compose -f docker-compose.prod.yml down
```

## Environment Variables

Create a `.env` file in the project root:

```env
# OpenAI Configuration
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here

# Application Configuration
NODE_ENV=production
REACT_APP_API_URL=https://your-api-endpoint.com

# Security
NGINX_SSL_CERT_PATH=/path/to/ssl/cert.pem
NGINX_SSL_KEY_PATH=/path/to/ssl/private.key

# Database (if needed in future)
DATABASE_URL=postgresql://user:pass@localhost:5432/nhs_triage

# Monitoring
ENABLE_ANALYTICS=true
LOG_LEVEL=info
```

## Cloud Deployment Examples

### AWS ECS Deployment
```bash
# Build and push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-east-1.amazonaws.com
docker tag nhs-triage-app:prod 123456789012.dkr.ecr.us-east-1.amazonaws.com/nhs-triage-app:latest
docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/nhs-triage-app:latest

# Deploy to ECS (requires ECS CLI or CDK)
ecs-cli compose --file docker-compose.prod.yml service up
```

### Google Cloud Run Deployment
```bash
# Build and push to GCR
docker tag nhs-triage-app:prod gcr.io/your-project-id/nhs-triage-app:latest
docker push gcr.io/your-project-id/nhs-triage-app:latest

# Deploy to Cloud Run
gcloud run deploy nhs-triage-app \
  --image gcr.io/your-project-id/nhs-triage-app:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Azure Container Instances Deployment
```bash
# Build and push to ACR
az acr build --registry myregistry --image nhs-triage-app:latest .

# Deploy to ACI
az container create \
  --resource-group myResourceGroup \
  --name nhs-triage-app \
  --image myregistry.azurecr.io/nhs-triage-app:latest \
  --ports 80 443 \
  --environment-variables NODE_ENV=production
```

## Kubernetes Deployment

### Create Kubernetes Manifests
```yaml
# deployment.yml
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
      - name: nhs-triage-app
        image: nhs-triage-app:latest
        ports:
        - containerPort: 80
        env:
        - name: NODE_ENV
          value: "production"
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
  name: nhs-triage-app-service
spec:
  selector:
    app: nhs-triage-app
  ports:
  - port: 80
    targetPort: 80
  type: LoadBalancer
```

Apply with:
```bash
kubectl apply -f deployment.yml
```

## Monitoring and Health Checks

### Health Check Endpoint
The application includes a health check endpoint at `/health` that returns:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "1.0.0",
  "uptime": "24h 15m 30s"
}
```

### Monitoring Setup
```bash
# Add monitoring labels to containers
docker run -d \
  --name nhs-triage-app \
  --label monitoring=enabled \
  --label service=nhs-triage \
  -p 80:80 \
  nhs-triage-app:prod
```

## Troubleshooting

### Common Issues
1. **Port conflicts**: Change port mapping in docker-compose.yml
2. **Memory issues**: Increase Docker memory limits
3. **Build failures**: Check Node.js version compatibility
4. **SSL issues**: Verify certificate paths in nginx.conf

### Debug Commands
```bash
# Check container logs
docker logs nhs-triage-app

# Inspect container
docker inspect nhs-triage-app

# Execute shell in container
docker exec -it nhs-triage-app /bin/sh

# Check nginx config
docker exec nhs-triage-app nginx -t

# View nginx access logs
docker exec nhs-triage-app tail -f /var/log/nginx/access.log
```

## Security Best Practices

1. **Environment Variables**: Never commit API keys to version control
2. **SSL/TLS**: Always use HTTPS in production
3. **Image Scanning**: Run security scans on Docker images
4. **Regular Updates**: Keep base images and dependencies updated
5. **Network Security**: Use Docker networks and firewalls appropriately

## Performance Optimization

1. **Multi-stage builds**: Reduces final image size
2. **Nginx compression**: Enabled gzip compression
3. **Static file caching**: Browser caching for assets
4. **Health checks**: Proper container health monitoring
5. **Resource limits**: Set appropriate CPU and memory limits
