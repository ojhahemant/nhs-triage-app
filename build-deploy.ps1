# NHS Triage App - Build and Deploy PowerShell Script

param(
    [string]$Version = "latest",
    [string]$Command = "build"
)

# Configuration
$AppName = "nhs-triage-app"
$Registry = $env:DOCKER_REGISTRY
$BuildDate = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
$GitCommit = try { (git rev-parse --short HEAD 2>$null) } catch { "unknown" }

# Functions
function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

function Show-Help {
    @"
NHS Triage App - Build and Deploy PowerShell Script

Usage: .\build-deploy.ps1 [-Version VERSION] [-Command COMMAND]

Commands:
    build           Build Docker image (default)
    push            Build and push to registry
    deploy          Deploy locally with docker-compose
    deploy-prod     Deploy for production
    clean           Clean up images and containers
    help            Show this help

Examples:
    .\build-deploy.ps1                                    # Build with latest tag
    .\build-deploy.ps1 -Version "v1.0.0"                 # Build with specific version
    .\build-deploy.ps1 -Version "latest" -Command "push" # Build and push to registry
    .\build-deploy.ps1 -Command "deploy"                 # Build and deploy locally

Environment Variables:
    DOCKER_REGISTRY             Docker registry URL
    REACT_APP_OPENAI_API_KEY    OpenAI API key
    REACT_APP_OPENAI_MODEL      OpenAI model (default: gpt-4o)

"@
}

function Build-Image {
    Write-Info "Building Docker image: ${AppName}:${Version}"
    
    $buildArgs = @(
        "--build-arg", "BUILD_DATE=$BuildDate",
        "--build-arg", "GIT_COMMIT=$GitCommit",
        "--build-arg", "VERSION=$Version",
        "-t", "${AppName}:${Version}",
        "."
    )
    
    & docker build @buildArgs
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Docker build failed"
        exit 1
    }
    
    if ($Registry) {
        & docker tag "${AppName}:${Version}" "${Registry}/${AppName}:${Version}"
        Write-Success "Tagged image for registry: ${Registry}/${AppName}:${Version}"
    }
    
    Write-Success "Build completed successfully"
}

function Push-Image {
    if (-not $Registry) {
        Write-Error "DOCKER_REGISTRY environment variable not set"
        exit 1
    }
    
    Write-Info "Pushing image to registry: ${Registry}/${AppName}:${Version}"
    & docker push "${Registry}/${AppName}:${Version}"
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Docker push failed"
        exit 1
    }
    
    Write-Success "Push completed successfully"
}

function Deploy-Local {
    Write-Info "Deploying locally with docker-compose"
    
    # Check if .env file exists
    if (-not (Test-Path ".env")) {
        Write-Error ".env file not found. Creating template..."
        @"
# OpenAI Configuration
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
REACT_APP_OPENAI_MODEL=gpt-4o
REACT_APP_OPENAI_TEMPERATURE=0.7
"@ | Out-File -FilePath ".env" -Encoding UTF8
        Write-Error "Please update .env file with your API key and run again"
        exit 1
    }
    
    & docker-compose up -d
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Docker compose deployment failed"
        exit 1
    }
    
    Write-Success "Application deployed locally"
    Write-Info "Access the application at: http://localhost:3000"
    Write-Info "View logs with: docker-compose logs -f"
}

function Deploy-Production {
    Write-Info "Deploying for production"
    
    # Check if API key is set
    if (-not $env:REACT_APP_OPENAI_API_KEY) {
        Write-Error "REACT_APP_OPENAI_API_KEY environment variable not set"
        exit 1
    }
    
    & docker-compose -f docker-compose.prod.yml up -d
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Production deployment failed"
        exit 1
    }
    
    Write-Success "Production deployment completed"
    Write-Info "Access the application at: http://localhost"
}

function Clean-Up {
    Write-Info "Cleaning up Docker images and containers"
    
    # Stop and remove containers
    & docker-compose down --remove-orphans 2>$null
    & docker-compose -f docker-compose.prod.yml down --remove-orphans 2>$null
    
    # Remove images
    & docker rmi "${AppName}:${Version}" 2>$null
    if ($Registry) {
        & docker rmi "${Registry}/${AppName}:${Version}" 2>$null
    }
    
    # Clean up dangling images
    & docker image prune -f
    
    Write-Success "Cleanup completed"
}

function Test-Health {
    Write-Info "Performing health check"
    
    $retries = 30
    $count = 0
    
    while ($count -lt $retries) {
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:3000/health" -Method GET -TimeoutSec 5
            if ($response.StatusCode -eq 200) {
                Write-Success "Application is healthy"
                return $true
            }
        }
        catch {
            # Continue trying
        }
        
        $count++
        Write-Info "Waiting for application to be ready... ($count/$retries)"
        Start-Sleep -Seconds 2
    }
    
    Write-Error "Health check failed after $retries attempts"
    return $false
}

# Main execution
switch ($Command.ToLower()) {
    "build" {
        Build-Image
    }
    "push" {
        Build-Image
        Push-Image
    }
    "deploy" {
        Build-Image
        Deploy-Local
        Test-Health
    }
    "deploy-prod" {
        Build-Image
        Deploy-Production
        Test-Health
    }
    "clean" {
        Clean-Up
    }
    "help" {
        Show-Help
    }
    default {
        Write-Error "Unknown command: $Command"
        Show-Help
        exit 1
    }
}
