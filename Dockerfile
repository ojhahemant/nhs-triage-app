name: Build and Deploy NHS Triage App

on:
  push:
    branches: [ main, develop ]
    tags: [ 'v*' ]
  pull_request:
    branches: [ main ]

env:
  REGISTRY: ghcr.io
  DOCKER_HUB_REGISTRY: docker.io
  IMAGE_NAME: ${{ github.repository }}
  DOCKER_HUB_IMAGE: ojhahemant/nhs-triage-app

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
      
    - name: Upload coverage reports
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info

  build:
    needs: test
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    outputs:
      docker-hub-image: ${{ steps.docker-hub-meta.outputs.tags }}
      
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v3
      
    # Login to GitHub Container Registry
    - name: Log in to GitHub Container Registry
      uses: docker/login-action@v3
      with:
        registry: ${{ env.REGISTRY }}
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}
        
    # Login to Docker Hub
    - name: Log in to Docker Hub
      uses: docker/login-action@v3
      with:
        registry: ${{ env.DOCKER_HUB_REGISTRY }}
        username: ${{ secrets.DOCKER_HUB_USERNAME }}
        password: ${{ secrets.DOCKER_HUB_TOKEN }}
          
    # Docker Hub metadata
    - name: Extract Docker Hub metadata
      id: docker-hub-meta
      uses: docker/metadata-action@v5
      with:
        images: ${{ env.DOCKER_HUB_IMAGE }}
        tags: |
          type=ref,event=branch
          type=ref,event=pr
          type=semver,pattern={{version}}
          type=semver,pattern={{major}}.{{minor}}
          type=sha
          type=raw,value=latest,enable={{is_default_branch}}
          
    # Build and push to Docker Hub
    - name: Build and push Docker image
      uses: docker/build-push-action@v5
      with:
        context: .
        push: true
        tags: ${{ steps.docker-hub-meta.outputs.tags }}
        build-args: |
          REACT_APP_OPENAI_API_KEY=${{ secrets.OPENAI_API_KEY }}
          REACT_APP_OPENAI_MODEL=gpt-4o
          REACT_APP_OPENAI_TEMPERATURE=0.7
        cache-from: type=gha
        cache-to: type=gha,mode=max

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
        image-ref: ${{ env.DOCKER_HUB_IMAGE }}:${{ github.sha }}
        format: 'sarif'
        output: 'trivy-results.sarif'
        
    - name: Upload Trivy scan results to GitHub Security tab
      uses: github/codeql-action/upload-sarif@v2
      with:
        sarif_file: 'trivy-results.sarif'

  deploy-production:
    needs: [build, security-scan]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Deploy to UpCloud Production
      uses: appleboy/ssh-action@v1.0.0
      with:
        host: ${{ secrets.UPCLOUD_PRODUCTION_HOST }}
        username: ${{ secrets.UPCLOUD_USERNAME }}
        password: ${{ secrets.UPCLOUD_PASSWORD }}
        script: |
          # Install Docker if not present
          if ! command -v docker &> /dev/null; then
            echo "Installing Docker..."
            sudo apt update
            sudo apt install -y apt-transport-https ca-certificates curl software-properties-common
            curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
            sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
            sudo apt update
            sudo apt install -y docker-ce
            sudo usermod -aG docker ubuntu
            
            # Install Docker Compose
            sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
            sudo chmod +x /usr/local/bin/docker-compose
          fi
          
          # Navigate to app directory
          mkdir -p /opt/nhs-triage-app
          cd /opt/nhs-triage-app
          
          # Create docker-compose.yml
          cat > docker-compose.yml << 'EOF'
          services:
            nhs-triage-app:
              image: ojhahemant/nhs-triage-app:latest
              ports:
                - "80:80"
                - "443:443"
              restart: always
              healthcheck:
                test: ["CMD", "curl", "-f", "http://localhost:80/health"]
                interval: 30s
                timeout: 10s
                retries: 3
                start_period: 10s
          networks:
            default:
              name: nhs-triage-production
          EOF
          
          # Pull latest image and restart
          sudo docker-compose pull
          sudo docker-compose up -d
          
          # Clean up old images
          sudo docker image prune -f
          
          echo "Production deployment completed!"
          echo "App available at: http://95.111.194.233"
          
    - name: Create GitHub Release
      if: startsWith(github.ref, 'refs/tags/v')
      uses: actions/create-release@v1
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      with:
        tag_name: ${{ github.ref }}
        release_name: NHS Triage App ${{ github.ref }}
        body: |
          🚀 **NHS Triage App Deployment**

          **Deployment completed:**
          - ✅ Deployed to UpCloud server
          - ✅ Available at: http://95.111.194.233
          - ✅ Docker Hub image: ${{ env.DOCKER_HUB_IMAGE }}:latest

        draft: false
        prerelease: false