# NHS Triage App - Complete UpCloud Deployment Guide with GitHub Actions

This comprehensive guide walks you through deploying your NHS Triage Application to UpCloud using GitHub Actions for automated CI/CD pipeline. We'll cover everything from setting up your GitHub repository to deploying on UpCloud's Managed Kubernetes service.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Setting Up GitHub Repository](#setting-up-github-repository)
3. [Configuring GitHub Actions Secrets](#configuring-github-actions-secrets)
4. [Setting Up UpCloud Account](#setting-up-upcloud-account)
5. [Creating UpCloud Managed Kubernetes Cluster](#creating-upcloud-managed-kubernetes-cluster)
6. [Configuring UpCloud Deployment Files](#configuring-upcloud-deployment-files)
7. [GitHub Actions Workflow for UpCloud](#github-actions-workflow-for-upcloud)
8. [Deployment Process](#deployment-process)
9. [Monitoring and Maintenance](#monitoring-and-maintenance)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 Prerequisites

Before starting, ensure you have:

- **Local Development Environment:**
  - Git installed on your computer
  - Docker Desktop installed and running
  - Node.js 18+ installed
  - A code editor (VS Code recommended)

- **Accounts:**
  - GitHub account (free tier is sufficient)
  - UpCloud account ([sign up here](https://signup.upcloud.com/))
  - OpenAI API key for the triage functionality

---

## 🚀 Setting Up GitHub Repository

### Step 1: Create New Repository

1. **Go to GitHub:**
   - Navigate to [github.com](https://github.com)
   - Click the "+" icon in the top-right corner
   - Select "New repository"

2. **Repository Settings:**
   ```
   Repository name: nhs-triage-app
   Description: NHS Plastic Surgery Triage System with AI Assessment
   Visibility: Private (recommended for healthcare applications)
   Initialize with: README (check this box)
   ```

3. **Click "Create repository"**

### Step 2: Clone Repository to Your Computer

```bash
# Open terminal/command prompt and navigate to your projects folder
cd C:\PROJECTS\NHS\

# Clone the repository
git clone https://github.com/YOUR_USERNAME/nhs-triage-app.git

# Navigate into the repository
cd nhs-triage-app
```

### Step 3: Copy Your Application Files

```bash
# Copy all files from your current project to the new repository
# Windows PowerShell:
Copy-Item "C:\PROJECTS\NHS\app V6\triage_app_V2\*" -Destination "." -Recurse -Force

# Linux/Mac:
# cp -r /path/to/your/current/project/* .
```

### Step 4: Initial Commit and Push

```bash
# Add all files to git
git add .

# Create initial commit
git commit -m "Initial commit: NHS Triage Application with Docker support"

# Push to GitHub
git push origin main
```

---

## 🔐 Configuring GitHub Actions Secrets

GitHub Actions needs secure access to your services. We'll store sensitive information as repository secrets.

### Step 1: Access Repository Secrets

1. Go to your GitHub repository
2. Click **Settings** tab
3. In the left sidebar, click **Secrets and variables** → **Actions**

### Step 2: Add Required Secrets

Click **New repository secret** for each of these:

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `OPENAI_API_KEY` | `sk-...` | Your OpenAI API key |
| `UPCLOUD_USERNAME` | `your-username` | UpCloud account username |
| `UPCLOUD_PASSWORD` | `your-password` | UpCloud account password |
| `DOCKER_HUB_USERNAME` | `your-dockerhub-username` | Docker Hub username (optional) |
| `DOCKER_HUB_PASSWORD` | `your-dockerhub-password` | Docker Hub password (optional) |

### Step 3: Environment Variables

Add these as **Variables** (not secrets):

| Variable Name | Value | Description |
|---------------|-------|-------------|
| `UPCLOUD_ZONE` | `fi-hel1` | UpCloud availability zone |
| `CLUSTER_NAME` | `nhs-triage-cluster` | Kubernetes cluster name |
| `APP_NAME` | `nhs-triage-app` | Application name |

---

## ☁️ Setting Up UpCloud Account

### Step 1: Create UpCloud Account

1. Visit [UpCloud Sign Up](https://signup.upcloud.com/)
2. Fill in your details:
   ```
   Email: your-email@domain.com
   Password: [strong password]
   Company: NHS/Healthcare Organization
   Country: United Kingdom
   ```
3. Verify your email address
4. Add payment method (UpCloud offers $25 free credit for new accounts)

### Step 2: Access UpCloud Control Panel

1. Log in to [UpCloud Control Panel](https://hub.upcloud.com/)
2. Familiarize yourself with the dashboard
3. Note your account details for API access

### Step 3: Generate API Credentials

1. In UpCloud Control Panel, go to **Account** → **API Access**
2. Click **Create API User**
3. Set permissions:
   - Kubernetes: Full access
   - Servers: Full access
   - Storage: Full access
   - Networks: Full access
4. Save the API username and password securely

---

## 🛠️ Creating UpCloud Managed Kubernetes Cluster

### Step 1: Access Kubernetes Service

1. In UpCloud Control Panel, click **Kubernetes** in the left menu
2. Click **Create new cluster**

### Step 2: Configure Cluster Settings

**Basic Configuration:**
```
Cluster name: nhs-triage-cluster
Zone: fi-hel1 (Helsinki, Finland - GDPR compliant)
Kubernetes version: Latest stable version
```

**Network Configuration:**
```
Private Network: Create new
Network name: nhs-triage-network
IP range: 10.0.1.0/24
DHCP: Enabled
Default route from DHCP: Disabled
```

**API Access:**
```
Allow API access from: Anywhere (0.0.0.0/0)
Note: You can restrict this to specific IPs later for security
```

### Step 3: Configure Node Group

**Node Group Settings:**
```
Name: nhs-triage-workers
Server plan: 2xCPU-4GB (sufficient for the application)
Node count: 2 (for high availability)
Operating system: Ubuntu 20.04
Anti-affinity: Enabled (for better distribution)
```

**SSH Keys:**
1. Add your SSH public key in **Account** → **SSH Keys**
2. Select it for the node group

### Step 4: Create Cluster

1. Review all settings
2. Click **Create**
3. **Wait 5-10 minutes** for cluster creation

### Step 5: Download Kubeconfig

1. Once cluster is ready, go to cluster **Overview**
2. Download the `kubeconfig.yaml` file
3. Save it securely - you'll need it for GitHub Actions

---

## 🔧 Configuring UpCloud Deployment Files

### Step 1: Create Kubernetes Deployment Manifests

Create `k8s/` directory in your repository:

```bash
mkdir k8s
```

### Step 2: Create Deployment Configuration

Create `k8s/deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nhs-triage-app
  labels:
    app: nhs-triage-app
spec:
  replicas: 2
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
        image: ghcr.io/YOUR_USERNAME/nhs-triage-app:latest
        ports:
        - containerPort: 80
        env:
        - name: NODE_ENV
          value: "production"
        - name: REACT_APP_OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: openai-api-key
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5
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
    protocol: TCP
  type: LoadBalancer
---
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
data:
  openai-api-key: BASE64_ENCODED_API_KEY
```

### Step 3: Create ConfigMap for Nginx

Create `k8s/configmap.yaml`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: nginx-config
data:
  nginx.conf: |
    user nginx;
    worker_processes auto;
    error_log /var/log/nginx/error.log notice;
    pid /var/run/nginx.pid;

    events {
        worker_connections 1024;
    }

    http {
        include /etc/nginx/mime.types;
        default_type application/octet-stream;
        
        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
        
        # Gzip compression
        gzip on;
        gzip_vary on;
        gzip_min_length 1024;
        gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
        
        server {
            listen 80;
            server_name _;
            root /usr/share/nginx/html;
            index index.html;
            
            # Health check endpoint
            location /health {
                access_log off;
                return 200 "healthy\n";
                add_header Content-Type text/plain;
            }
            
            # Main application
            location / {
                try_files $uri $uri/ /index.html;
            }
            
            # Static assets caching
            location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
                expires 1y;
                add_header Cache-Control "public, immutable";
            }
        }
    }
```

---

## ⚙️ GitHub Actions Workflow for UpCloud

### Step 1: Create UpCloud-Specific Workflow

Create `.github/workflows/upcloud-deploy.yml`:

```yaml
name: Deploy to UpCloud Managed Kubernetes

on:
  push:
    branches: [ main, develop ]
    tags: [ 'v*' ]
  pull_request:
    branches: [ main ]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}
  UPCLOUD_ZONE: ${{ vars.UPCLOUD_ZONE }}
  CLUSTER_NAME: ${{ vars.CLUSTER_NAME }}
  APP_NAME: ${{ vars.APP_NAME }}

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run tests
      run: npm test -- --coverage --watchAll=false

    - name: Build application
      run: npm run build

  build:
    needs: test
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    outputs:
      image: ${{ steps.image.outputs.image }}
      digest: ${{ steps.build.outputs.digest }}

    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v3

    - name: Log in to Container Registry
      uses: docker/login-action@v3
      with:
        registry: ${{ env.REGISTRY }}
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}

    - name: Extract metadata
      id: meta
      uses: docker/metadata-action@v5
      with:
        images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
        tags: |
          type=ref,event=branch
          type=ref,event=pr
          type=semver,pattern={{version}}
          type=semver,pattern={{major}}.{{minor}}
          type=sha

    - name: Build and push Docker image
      id: build
      uses: docker/build-push-action@v5
      with:
        context: .
        push: true
        tags: ${{ steps.meta.outputs.tags }}
        labels: ${{ steps.meta.outputs.labels }}
        build-args: |
          BUILD_DATE=${{ github.event.head_commit.timestamp }}
          GIT_COMMIT=${{ github.sha }}
          VERSION=${{ steps.meta.outputs.version }}
        cache-from: type=gha
        cache-to: type=gha,mode=max

    - name: Output image
      id: image
      run: |
        echo "image=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}" >> $GITHUB_OUTPUT

  security-scan:
    needs: build
    runs-on: ubuntu-latest
    permissions:
      contents: read
      security-events: write
    steps:
    - name: Run Trivy vulnerability scanner
      uses: aquasecurity/trivy-action@master
      with:
        image-ref: ${{ needs.build.outputs.image }}
        format: 'sarif'
        output: 'trivy-results.sarif'

    - name: Upload Trivy scan results
      uses: github/codeql-action/upload-sarif@v2
      with:
        sarif_file: 'trivy-results.sarif'

  deploy-staging:
    needs: [build, security-scan]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    environment: staging

    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Setup kubectl
      uses: azure/setup-kubectl@v3
      with:
        version: 'latest'

    - name: Configure kubeconfig for UpCloud
      run: |
        mkdir -p $HOME/.kube
        echo "${{ secrets.UPCLOUD_KUBECONFIG }}" | base64 -d > $HOME/.kube/config
        chmod 600 $HOME/.kube/config

    - name: Verify cluster connection
      run: |
        kubectl cluster-info
        kubectl get nodes

    - name: Create namespace
      run: |
        kubectl create namespace nhs-triage-staging --dry-run=client -o yaml | kubectl apply -f -

    - name: Create secrets
      run: |
        kubectl create secret generic app-secrets \
          --from-literal=openai-api-key="${{ secrets.OPENAI_API_KEY }}" \
          --namespace=nhs-triage-staging \
          --dry-run=client -o yaml | kubectl apply -f -

    - name: Update deployment image
      run: |
        sed -i 's|ghcr.io/YOUR_USERNAME/nhs-triage-app:latest|${{ needs.build.outputs.image }}|g' k8s/deployment.yaml

    - name: Deploy to staging
      run: |
        kubectl apply -f k8s/ --namespace=nhs-triage-staging

    - name: Wait for rollout
      run: |
        kubectl rollout status deployment/nhs-triage-app --namespace=nhs-triage-staging --timeout=300s

    - name: Get service URL
      run: |
        kubectl get service nhs-triage-service --namespace=nhs-triage-staging

  deploy-production:
    needs: [build, security-scan]
    runs-on: ubuntu-latest
    if: startsWith(github.ref, 'refs/tags/v')
    environment: production

    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Setup kubectl
      uses: azure/setup-kubectl@v3
      with:
        version: 'latest'

    - name: Configure kubeconfig for UpCloud
      run: |
        mkdir -p $HOME/.kube
        echo "${{ secrets.UPCLOUD_KUBECONFIG }}" | base64 -d > $HOME/.kube/config
        chmod 600 $HOME/.kube/config

    - name: Create namespace
      run: |
        kubectl create namespace nhs-triage-production --dry-run=client -o yaml | kubectl apply -f -

    - name: Create secrets
      run: |
        kubectl create secret generic app-secrets \
          --from-literal=openai-api-key="${{ secrets.OPENAI_API_KEY }}" \
          --namespace=nhs-triage-production \
          --dry-run=client -o yaml | kubectl apply -f -

    - name: Update deployment image
      run: |
        sed -i 's|ghcr.io/YOUR_USERNAME/nhs-triage-app:latest|${{ needs.build.outputs.image }}|g' k8s/deployment.yaml

    - name: Deploy to production
      run: |
        kubectl apply -f k8s/ --namespace=nhs-triage-production

    - name: Wait for rollout
      run: |
        kubectl rollout status deployment/nhs-triage-app --namespace=nhs-triage-production --timeout=300s

    - name: Get service URL
      run: |
        echo "Application deployed! Check the LoadBalancer external IP:"
        kubectl get service nhs-triage-service --namespace=nhs-triage-production

    - name: Create GitHub Release
      uses: actions/create-release@v1
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      with:
        tag_name: ${{ github.ref }}
        release_name: NHS Triage App ${{ github.ref }}
        body: |
          🚀 **NHS Triage App Deployment**
          
          **Changes in this Release:**
          - Automated deployment to UpCloud Managed Kubernetes
          - Docker image: ${{ needs.build.outputs.image }}
          - Deployed to production namespace
          
          **Access the application:**
          Check the LoadBalancer external IP with:
          ```
          kubectl get service nhs-triage-service --namespace=nhs-triage-production
          ```
        draft: false
        prerelease: false
```

### Step 2: Add Kubeconfig Secret

1. In your local terminal, encode your kubeconfig:
   ```bash
   # Replace with your actual kubeconfig file path
   cat ~/.kube/config | base64 -w 0
   ```

2. Copy the output and add it as a repository secret:
   - Name: `UPCLOUD_KUBECONFIG`
   - Value: [the base64 encoded kubeconfig]

---

## 🚀 Deployment Process

### Step 1: Update Repository References

1. Replace `YOUR_USERNAME` in all files with your actual GitHub username
2. Update the image references in `k8s/deployment.yaml`

### Step 2: Commit and Push Changes

```bash
# Add all new files
git add .

# Commit changes
git commit -m "Add UpCloud Kubernetes deployment configuration"

# Push to trigger deployment
git push origin main
```

### Step 3: Monitor Deployment

1. **Go to GitHub repository → Actions tab**
2. **Watch the workflow execution:**
   - Test job runs first
   - Build and security scan run in parallel
   - Deploy job runs last (only on main branch)

3. **Check deployment status:**
   ```bash
   # If you have kubectl configured locally
   kubectl get pods --namespace=nhs-triage-staging
   kubectl get services --namespace=nhs-triage-staging
   ```

### Step 4: Access Your Application

1. **Get the LoadBalancer external IP:**
   ```bash
   kubectl get service nhs-triage-service --namespace=nhs-triage-staging
   ```

2. **Example output:**
   ```
   NAME                TYPE           CLUSTER-IP      EXTERNAL-IP                        PORT(S)
   nhs-triage-service  LoadBalancer   10.128.85.231   lb-abc123-1.upcloudlb.com          80:30123/TCP
   ```

3. **Access your application:**
   - Open: `http://lb-abc123-1.upcloudlb.com`

---

## 📊 Monitoring and Maintenance

### Application Health Monitoring

**Built-in Health Checks:**
- Kubernetes liveness probe: `/health` endpoint
- Readiness probe: Application startup verification
- Resource monitoring: CPU and memory usage

**Manual Health Check:**
```bash
# Check pod status
kubectl get pods --namespace=nhs-triage-production

# Check pod logs
kubectl logs -f deployment/nhs-triage-app --namespace=nhs-triage-production

# Check service status
kubectl get services --namespace=nhs-triage-production
```

### Updating Your Application

**For Development Updates:**
```bash
# Make your changes
git add .
git commit -m "Update: describe your changes"
git push origin develop  # Deploys to staging
```

**For Production Releases:**
```bash
# Create a release tag
git tag -a v1.0.1 -m "Release version 1.0.1"
git push origin v1.0.1  # Deploys to production
```

### Scaling Your Application

**Manual Scaling:**
```bash
# Scale to 3 replicas
kubectl scale deployment nhs-triage-app --replicas=3 --namespace=nhs-triage-production

# Check scaling status
kubectl get pods --namespace=nhs-triage-production
```

**Auto-scaling (optional):**
```yaml
# Add to k8s/hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: nhs-triage-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: nhs-triage-app
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

### Backup and Disaster Recovery

**Database Backups (if added later):**
- Use UpCloud's managed database backup features
- Automated daily backups
- Point-in-time recovery options

**Application State:**
- Stateless application design (current)
- Configuration stored in Kubernetes secrets
- Easy recreation from Docker images

---

## 🔧 Troubleshooting

### Common Issues and Solutions

**1. Docker Build Failures**
```bash
# Check build logs in GitHub Actions
# Common fixes:
- Ensure package.json is valid
- Check Node.js version compatibility
- Verify Docker base image availability
```

**2. Kubernetes Deployment Issues**
```bash
# Check pod status
kubectl describe pods --namespace=nhs-triage-production

# Common issues:
- Image pull errors: Check image name and registry access
- Resource limits: Increase memory/CPU limits
- Secret issues: Verify secret creation and references
```

**3. LoadBalancer Not Getting External IP**
```bash
# Check UpCloud LoadBalancer status
kubectl get events --namespace=nhs-triage-production

# Possible causes:
- UpCloud quota limits
- Network configuration issues
- LoadBalancer service misconfiguration
```

**4. Application Not Responding**
```bash
# Check application logs
kubectl logs -f deployment/nhs-triage-app --namespace=nhs-triage-production

# Check service connectivity
kubectl exec -it deployment/nhs-triage-app --namespace=nhs-triage-production -- curl http://localhost:80/health
```

### Performance Optimization

**Resource Tuning:**
```yaml
# Adjust in k8s/deployment.yaml
resources:
  requests:
    memory: "512Mi"    # Increase if needed
    cpu: "500m"        # Increase if needed
  limits:
    memory: "1Gi"      # Set appropriate limits
    cpu: "1000m"       # Based on usage patterns
```

**Caching Improvements:**
- Enable nginx gzip compression (already configured)
- Add CDN in front of LoadBalancer
- Implement browser caching headers

### Security Best Practices

**1. Network Security:**
```bash
# Restrict API access to specific IPs
# In UpCloud Control Panel → Kubernetes → API Access
```

**2. Secret Management:**
```bash
# Rotate secrets regularly
kubectl create secret generic app-secrets \
  --from-literal=openai-api-key="NEW_API_KEY" \
  --namespace=nhs-triage-production \
  --dry-run=client -o yaml | kubectl apply -f -
```

**3. Image Security:**
- Regular security scans (automated in GitHub Actions)
- Use minimal base images
- Keep dependencies updated

### Getting Help

**UpCloud Support:**
- 24/7 support via [UpCloud Support](https://upcloud.com/support/)
- Documentation: [UpCloud Docs](https://upcloud.com/docs/)
- Community: [UpCloud Community](https://github.com/UpCloudLtd)

**GitHub Actions:**
- Documentation: [GitHub Actions Docs](https://docs.github.com/en/actions)
- Community: [GitHub Community](https://github.com/orgs/community/discussions)

---

## 🎉 Congratulations!

You've successfully set up a complete CI/CD pipeline for your NHS Triage Application using GitHub Actions and UpCloud Managed Kubernetes. Your application now has:

✅ **Automated Testing** - Every code change is tested  
✅ **Container Security Scanning** - Automated vulnerability checks  
✅ **Staging Environment** - Safe testing before production  
✅ **Production Deployment** - Automatic deployment on releases  
✅ **High Availability** - Multiple replicas with load balancing  
✅ **Health Monitoring** - Built-in health checks and logging  
✅ **Scalability** - Easy scaling up or down based on demand  

Your NHS Triage Application is now production-ready and deployed on UpCloud's enterprise-grade infrastructure with full automation and monitoring capabilities!

## 📞 Next Steps

1. **Set up monitoring alerts** for application health
2. **Configure SSL/TLS certificates** for HTTPS access
3. **Add database integration** if needed for patient data storage
4. **Implement backup strategies** for critical data
5. **Set up log aggregation** for better debugging and monitoring

Your application is now ready to serve healthcare professionals with reliable, scalable, and secure AI-powered triage assessments!
