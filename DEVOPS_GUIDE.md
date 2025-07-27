A well-documented guide is crucial for maintaining and evolving any application, especially when a CI/CD pipeline and external services are involved.

Here's a comprehensive **Deployment and DevOps User Guide** for your **NHS Triage App**, designed for both developers and DevOps professionals. It includes actual values and best practices.

-----

# NHS Triage App: Deployment and DevOps User Guide

## Table of Contents

1.  [Introduction](https://www.google.com/search?q=%231-introduction)
2.  [Application Architecture Overview](https://www.google.com/search?q=%232-application-architecture-overview)
3.  [Local Development Environment Setup (For Developers)](https://www.google.com/search?q=%233-local-development-environment-setup-for-developers)
4.  [Version Control Strategy](https://www.google.com/search?q=%234-version-control-strategy)
5.  [Continuous Integration / Continuous Deployment (CI/CD) Pipeline](https://www.google.com/search?q=%235-continuous-integration--continuous-deployment-cicd-pipeline)
      * [Workflow Overview (`ci-cd.yml`)](https://www.google.com/search?q=%23workflow-overview-ci-cdyml)
      * [Secrets Management](https://www.google.com/search?q=%23secrets-management)
      * [Jobs Breakdown](https://www.google.com/search?q=%23jobs-breakdown)
          * [Test Job](https://www.google.com/search?q=%23test-job)
          * [Build Job](https://www.google.com/search?q=%23build-job)
          * [Deploy Job](https://www.google.com/search?q=%23deploy-job)
6.  [Infrastructure and Services](https://www.google.com/search?q=%236-infrastructure-and-services)
      * [UpCloud Production Server](https://www.google.com/search?q=%23upcloud-production-server)
      * [Cloudflare](https://www.google.com/search?q=%23cloudflare)
      * [GitHub Container Registry (GHCR)](https://www.google.com/search?q=%23github-container-registry-ghcr)
7.  [Troubleshooting and Maintenance](https://www.google.com/search?q=%237-troubleshooting-and-maintenance)
      * [Common CI/CD Workflow Issues](https://www.google.com/search?q=%23common-cicd-workflow-issues)
      * [Cloudflare Specific Errors (5xx Series)](https://www.google.com/search?q=%23cloudflare-specific-errors-5xx-series)
      * [Server-Side Debugging Commands](https://www.google.com/search?q=%23server-side-debugging-commands)
      * [Certbot SSL Certificate Renewals](https://www.google.com/search?q=%23certbot-ssl-certificate-renewals)
8.  [Future Enhancements and Roadmap](https://www.google.com/search?q=%238-future-enhancements-and-roadmap)

-----

## 1\. Introduction

This guide provides a comprehensive overview of the development, deployment, and operational aspects of the NHS Triage App. It's intended for all team members involved in developing, testing, or deploying the application. Our goal is to ensure a smooth, automated, and reliable process from code commit to production.

The NHS Triage App is a React-based front-end application integrated with an OpenAI model for medical triage assistance.

## 2\. Application Architecture Overview

The NHS Triage App follows a modern web application deployment architecture, leveraging several key services:

  * **Browser:** Users access the application via a web browser.
  * **Cloudflare:** Acts as a DNS provider, CDN (Content Delivery Network), and WAF (Web Application Firewall) for `triagemedical.org`. It handles global DNS resolution, caches static content, and provides a secure proxy layer, including SSL termination at the edge.
  * **UpCloud Production Server:** Our primary hosting provider. This is an Ubuntu Linux virtual machine where the application's Docker container runs.
  * **Nginx (Host Server):** Runs directly on the UpCloud server. It acts as a reverse proxy, accepting incoming web requests (HTTP/HTTPS) and forwarding them to the Docker container running the NHS Triage App. It also handles SSL termination using certificates from Let's Encrypt via Certbot.
  * **Docker Container:** Encapsulates the NHS Triage App (React application) and its dependencies. It serves the static React build on port 80 internally.
  * **GitHub Container Registry (GHCR):** Stores the Docker images of the NHS Triage App after successful builds from the CI/CD pipeline.

**Flow of a Web Request:**

1.  User's browser sends a request to `https://triagemedical.org`.
2.  Cloudflare (acting as DNS for `triagemedical.org`) resolves the domain and intercepts the request.
3.  Cloudflare processes the request (e.g., caching, security rules, SSL termination from browser).
4.  Cloudflare then sends an encrypted request (SSL/TLS mode "Full") to our UpCloud server's public IP (`213.163.205.146`) on port 443.
5.  Nginx on the UpCloud server receives the request, handles SSL (using Certbot's certificate), and then proxies the request to the Docker container running the NHS Triage App on `http://localhost:3000`.
6.  The Docker container serves the appropriate content (HTML, CSS, JS).
7.  The response travels back through Nginx, Cloudflare, and finally to the user's browser.

## 3\. Local Development Environment Setup (For Developers)

To contribute to the NHS Triage App, developers need to set up a local development environment.

**Prerequisites:**

  * **Git:** For version control.
  * **Node.js (v18.x):** The JavaScript runtime for React.
      * *Recommended Installation:* Use `nvm` (Node Version Manager) to easily switch Node.js versions.
        ```bash
        # Install nvm (if not already installed)
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
        # Close and reopen your terminal, or source your shell profile
        nvm install 18 # Installs Node.js v18
        nvm use 18     # Sets v18 as default
        ```
  * **npm (comes with Node.js):** Node Package Manager.
  * **Docker Desktop (Optional but Recommended):** If you plan to work on Dockerfile changes or test containerization locally.

**Setup Steps:**

1.  **Clone the Repository:**

    ```bash
    git clone https://github.com/ojhahemant/nhs-triage-app.git
    cd nhs-triage-app
    ```

2.  **Install Dependencies:**

    ```bash
    npm ci
    ```

    *Note: `npm ci` is preferred over `npm install` in CI/CD and for clean installations, as it relies on `package-lock.json`.*

3.  **Configure Local Environment Variables (for OpenAI API Key):**
    The app requires an OpenAI API key. For local development, create a `.env.local` file in the project root:

    ```
    REACT_APP_OPENAI_API_KEY=your_local_openai_api_key_here
    REACT_APP_OPENAI_MODEL=gpt-4o
    REACT_APP_OPENAI_TEMPERATURE=0.7
    ```

    *Replace `your_local_openai_api_key_here` with a valid OpenAI API key for testing purposes.*
    *Do NOT commit `.env.local` to Git.* (It should be in `.gitignore`).

4.  **Run the App Locally:**

    ```bash
    npm start
    ```

    This will start the development server, usually at `http://localhost:3000`, and automatically open it in your browser. Changes saved to files will trigger live reloads.

5.  **Run Tests Locally:**

    ```bash
    npm test
    ```

    This will execute your test suite.

## 4\. Version Control Strategy

We follow a simplified GitFlow model:

  * **`main` branch:** Represents the production-ready code. All deployments to the production environment originate from this branch.
  * **Feature Branches:** For all new features, bug fixes, or experimental work, create a new branch from `main`.
      * **Naming Convention:** `feature/<feature-name>`, `bugfix/<issue-description>`, `hotfix/<critical-fix>`.
  * **Pull Requests (PRs):** All changes must be submitted via a Pull Request to the `main` branch.
      * **Review:** Require at least one approving review before merging.
      * **CI Checks:** PRs must pass all CI checks (tests, linting) defined in the workflow before merging.
  * **Commit Messages:**
      * **Clarity:** Be clear and concise.
      * **Imperative Mood:** Start with an imperative verb (e.g., "Fix:", "Add:", "Update:").
      * **Example:** `feat: Implement user authentication module` or `fix: Correct typo in homepage content`.

## 5\. Continuous Integration / Continuous Deployment (CI/CD) Pipeline

Our CI/CD pipeline is managed using GitHub Actions, defined in the `.github/workflows/ci-cd.yml` file. This automates testing, building, and deploying the application.

### Workflow Overview (`ci-cd.yml`)

```yaml
name: Build and Deploy NHS Triage App

on:
  push:
    branches: [ main ] # Triggers on push to the main branch

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }} # Resolves to "ojhahemant/nhs-triage-app"

jobs:
  # ... (test, build, deploy jobs defined below)
```

**Trigger:** The workflow automatically triggers whenever code is pushed to the `main` branch.

**Environment Variables:**

  * `REGISTRY`: The Docker registry to use (`ghcr.io` for GitHub Container Registry).
  * `IMAGE_NAME`: The name of the Docker image, derived from the GitHub repository name (e.g., `ojhahemant/nhs-triage-app`).

### Secrets Management

Sensitive information (like SSH keys, API keys) is stored securely as **GitHub Repository Secrets**. They are never hardcoded in the workflow files.

**Required Secrets:**

  * `UPCLOUD_PRODUCTION_HOST`: The public IP address or hostname of your UpCloud production server (e.g., `213.163.205.146` or `your-server-hostname.upcloud.host`).
  * `UPCLOUD_USERNAME`: The SSH username for your UpCloud server (e.g., `root` or a dedicated deployment user).
  * `UPCLOUD_SSH_KEY`: The private SSH key associated with `UPCLOUD_USERNAME` for key-based authentication. This should be a single-line private key.
  * `OPENAI_API_KEY`: The OpenAI API key used to build the React application with the correct API endpoint.

**How to add/manage secrets:**

1.  Go to your GitHub repository.
2.  Click on **"Settings"**.
3.  In the left sidebar, navigate to **"Secrets and variables" \> "Actions"**.
4.  Click **"New repository secret"** to add any missing secrets or update existing ones.

### Jobs Breakdown

The `ci-cd.yml` workflow consists of three sequential jobs: `test`, `build`, and `deploy`.

#### Test Job

  * **Purpose:** Runs automated tests (e.g., unit tests, integration tests) to ensure code quality and prevent regressions.
  * **Runs on:** `ubuntu-latest` (a fresh virtual machine).
  * **Steps:**
    1.  `actions/checkout@v4`: Checks out the repository code.
    2.  `actions/setup-node@v4`: Sets up Node.js v18 and configures `npm` caching for faster dependency installation.
    3.  `npm ci`: Installs project dependencies securely based on `package-lock.json`.
    4.  `npm test -- --passWithNoTests --watchAll=false`: Executes the test suite. If tests fail, the workflow stops.

#### Build Job

  * **Purpose:** Builds the Docker image of the NHS Triage App and pushes it to the GitHub Container Registry.
  * **Dependencies:** `needs: test` (only runs if the `test` job succeeds).
  * **Runs on:** `ubuntu-latest`.
  * **Permissions:** `contents: read`, `packages: write` (required to push to GHCR).
  * **Steps:**
    1.  `actions/checkout@v4`: Checks out the code again.
    2.  `docker/setup-buildx-action@v3`: Sets up Docker Buildx for efficient Docker builds.
    3.  `docker/login-action@v3`: Logs into `ghcr.io` using `GITHUB_ACTOR` (your GitHub username) and `GITHUB_TOKEN` (a temporary token provided by GitHub Actions with `packages: write` scope).
    4.  `docker/build-push-action@v5`:
          * `context: .`: Builds from the current directory.
          * `push: true`: Pushes the image to the registry.
          * `tags: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest`: Tags the image with `ghcr.io/ojhahemant/nhs-triage-app:latest`.
          * `build-args`: Passes environment variables from GitHub Secrets directly into the Docker image build process for the React app.
              * `REACT_APP_OPENAI_API_KEY=${{ secrets.OPENAI_API_KEY }}`
              * `REACT_APP_OPENAI_MODEL=gpt-4o`
              * `REACT_APP_OPENAI_TEMPERATURE=0.7`
              * *Note: While `OPENAI_API_KEY` is a secret, it is passed as a build argument. Ensure your Dockerfile doesn't expose it in the final image layer if sensitive.* For client-side apps this is typically fine as the key is consumed by the client.

#### Deploy Job

  * **Purpose:** Deploys the latest Docker image to the UpCloud production server, updates Nginx, and ensures SSL is configured.
  * **Dependencies:** `needs: build` (only runs if the `build` job succeeds).
  * **Runs on:** `ubuntu-latest`.
  * **Condition:** `if: github.ref == 'refs/heads/main'` (ensures deployment only happens on pushes to the `main` branch).
  * **Steps:**
    1.  `appleboy/ssh-action@v1.0.0`: Connects to the UpCloud server via SSH.
          * `host`: `${{ secrets.UPCLOUD_PRODUCTION_HOST }}`
          * `username`: `${{ secrets.UPCLOUD_USERNAME }}`
          * `key`: `${{ secrets.UPCLOUD_SSH_KEY }}`
          * `script`: Contains a multi-line shell script executed on the server:
              * **Directory Setup:** Creates `/opt/nhs-triage-app` and navigates into it.
              * **Docker Management:**
                  * Stops and removes any existing `nhs-app` Docker container.
                  * Pulls the latest image: `ghcr.io/ojhahemant/nhs-triage-app:latest`.
                  * Runs the new container: `sudo docker run -d --name nhs-app -p 3000:80 --restart always ghcr.io/ojhahemant/nhs-triage-app:latest`.
                      * `-p 3000:80`: Maps server port 3000 to container port 80.
                      * `--restart always`: Ensures the container restarts on server reboot or crash.
              * **Nginx & Certbot Installation:** Installs `nginx`, `certbot`, and `python3-certbot-nginx` if not present.
              * **Nginx Configuration:** Writes the Nginx server block for `triagemedical.org` and `www.triagemedical.org`. This proxies requests from ports 80/443 to the Docker app on `localhost:3000`.
              * **Nginx Activation:** Creates a symlink, removes the default Nginx site, tests configuration syntax, and restarts Nginx.
              * **Certbot SSL:** Obtains/renews SSL certificates from Let's Encrypt for `triagemedical.org` and `www.triagemedical.org` using the Nginx plugin. (`--non-interactive --agree-tos --email ojhahemant@gmail.com`).
              * **Confirmation:** Prints a success message.

## 6\. Infrastructure and Services

### UpCloud Production Server

  * **Provider:** UpCloud
  * **Operating System:** Ubuntu Linux (e.g., Ubuntu 24.04 LTS Noble Numbat)
  * **Public IPv4 Address:** `213.163.205.146`
  * **SSH Access:** Port 22 must be open in the UpCloud firewall. Access is via SSH key (configured in GitHub Secrets).
  * **Web Traffic Ports:** Ports 80 (HTTP) and 443 (HTTPS) must be open in the UpCloud firewall to allow traffic from Cloudflare.
  * **Required Software:** Docker, Nginx, Certbot. All are installed by the CI/CD pipeline or manually if needed.
  * **Application Directory:** `/opt/nhs-triage-app`

### Cloudflare

  * **Domain:** `triagemedical.org`
  * **Purpose:** DNS management, CDN, SSL termination, security.
  * **DNS Records:**
      * **Type:** `A`
      * **Name:** `triagemedical.org`
      * **Content:** `213.163.205.146` (your UpCloud server's public IPv4)
      * **Proxy Status:** **Proxied (orange cloud)** - *Crucial for Cloudflare services.*
      * **Type:** `A`
      * **Name:** `www`
      * **Content:** `213.163.205.146` (your UpCloud server's public IPv4)
      * **Proxy Status:** **Proxied (orange cloud)** - *Crucial for Cloudflare services.*
  * **SSL/TLS Encryption Mode:** **Full** (under SSL/TLS -\> Overview). This ensures end-to-end encryption.
  * **Edge Certificates:** Cloudflare automatically provisions and manages a Universal SSL certificate for `triagemedical.org` and `*.triagemedical.org`. This should be "Active" under SSL/TLS -\> Edge Certificates.

### GitHub Container Registry (GHCR)

  * **Location:** `ghcr.io`
  * **Image Path:** `ghcr.io/ojhahemant/nhs-triage-app:latest`
  * **Purpose:** Securely stores the Docker images built by the CI/CD pipeline, making them available for deployment. Authentication is handled automatically by GitHub Actions with `GITHUB_TOKEN`.

## 7\. Troubleshooting and Maintenance

### Common CI/CD Workflow Issues

  * **`test` job failure:** Check `npm ci` logs for dependency issues, or `npm test` logs for failing tests.
  * **`build` job failure:**
      * Check Docker build logs for syntax errors in `Dockerfile` or missing build contexts.
      * Ensure `OPENAI_API_KEY` secret is correctly set if the build requires it.
      * Verify GitHub token permissions (unlikely if `packages: write` is set).
  * **`deploy` job failure (SSH):**
      * **`Host key verification failed`:** The server's SSH host key changed or is not known. You might need to clear the known hosts entry on the GitHub Actions runner (rarely needed, `appleboy/ssh-action` usually handles this).
      * **`Permission denied (publickey)`:** SSH key in `UPCLOUD_SSH_KEY` is incorrect, corrupted, or doesn't match the username. Double-check the key format (must be a single line).
      * **Connection Timeout:** Server is down, unreachable, or port 22 (SSH) is blocked by a firewall (UpCloud firewall, local UFW, etc.).
  * **`deploy` job failure (script errors):** Review the SSH script output in the workflow logs for specific command failures (e.g., `docker pull` failed, `nginx -t` failed, `certbot` errors).

### Cloudflare Specific Errors (5xx Series)

  * **Error 521: Web server is down / Connection refused:**
      * **Meaning:** Cloudflare successfully connected to your server's IP, but the server actively refused the connection.
      * **Likely Causes (based on our debugging):**
          * **Missing SSL Certificate on Origin:** Most common. Nginx tried to establish SSL but didn't have a valid certificate (as we saw).
          * **Nginx Not Running/Proxying:** Nginx process crashed, or its configuration is incorrect, preventing it from listening on 80/443 or proxying to 3000.
          * **App not running on `localhost:3000`:** Docker container crashed or isn't listening.
      * **Solution:**
        1.  **Verify Certbot:** Re-run Certbot (`sudo certbot certificates` and `sudo certbot --nginx ... --force-renewal`) on the server.
        2.  **Verify Nginx & Docker:** Use diagnostic commands (see below) to ensure Nginx and Docker container are running and listening.
        3.  **Cloudflare SSL/TLS Mode:** Confirm it's **"Full"**.
  * **Error 522: Connection timed out:**
      * **Meaning:** Cloudflare tried to connect but didn't get a response within a set time.
      * **Likely Causes:** Server firewall blocking Cloudflare IPs, server overloaded, network issues between Cloudflare and server.
      * **Solution:** Check UpCloud firewall, server load, and network stability.
  * **Error 525: SSL Handshake Failed:**
      * **Meaning:** Cloudflare and your origin server couldn't agree on an SSL handshake.
      * **Likely Causes:** Mismatch in SSL/TLS versions/ciphers, invalid/expired SSL certificate on origin.
      * **Solution:** Ensure Certbot certificate is valid, Cloudflare SSL mode is "Full".

### Server-Side Debugging Commands

When investigating deployment issues, SSH into your UpCloud server and run these commands. The `diagnose.yml` workflow can also run these for remote viewing.

  * **Docker Container Status:**
    ```bash
    sudo docker ps -a
    ```
      * *Check `STATUS` column for `nhs-app` container (should be `Up ... (healthy)`).*
  * **Docker Container Logs:**
    ```bash
    sudo docker logs nhs-app
    ```
      * *Look for application errors or startup issues within the container.*
  * **Nginx Service Status:**
    ```bash
    sudo systemctl status nginx
    ```
      * *Check `Active` status (should be `active (running)`).*
  * **Nginx Error Logs:**
    ```bash
    sudo cat /var/log/nginx/error.log
    ```
      * *Look for recent `connect() failed` errors, especially to `localhost:3000`.*
  * **Verify Port 3000 Listener (Docker App):**
    ```bash
    sudo ss -tulpn | grep 3000
    ```
      * *Should show `docker-proxy` listening on `0.0.0.0:3000`.*
  * **Verify Nginx Listening Ports (HTTP/HTTPS):**
    ```bash
    sudo ss -tulpn | grep -E ':(80|443)'
    ```
      * *Should show Nginx listening on `0.0.0.0:80`, `0.0.0.0:443`, `[::]:80`, `[::]:443`.*
  * **Check Certbot Certificates:**
    ```bash
    sudo certbot certificates
    ```
      * *Ensure a `triagemedical.org` certificate is listed as `VALID`.*
  * **Test Nginx Configuration:**
    ```bash
    sudo nginx -t
    ```
      * *Should report `syntax is ok` and `test is successful`.*

### Certbot SSL Certificate Renewals

Let's Encrypt certificates are valid for 90 days. Your deployment script includes `sudo certbot --nginx ...`. Certbot automatically sets up a cron job or systemd timer to handle renewals in the background.

  * **Verify Renewal Timer (Ubuntu):**
    ```bash
    sudo systemctl list-timers | grep certbot
    ```
      * *You should see a timer for `certbot.timer`.*
  * **Force a Renewal (if needed for debugging/manual update):**
    ```bash
    sudo certbot renew --force-renewal
    sudo systemctl restart nginx
    ```
      * *Use `--force-renewal` sparingly, as it can hit Let's Encrypt rate limits.*

## 8\. Future Enhancements and Roadmap

As the app evolves, consider these DevOps enhancements:

  * **Environment-Specific Deployments:** Implement separate `staging` and `production` environments. This would involve:
      * Dedicated `staging` branch (e.g., `develop`).
      * Separate UpCloud server for staging.
      * Separate Nginx/Certbot configuration for a staging domain (e.g., `staging.triagemedical.org`).
      * Refining GitHub Actions to deploy to staging on pushes to `develop` and production on merges/pushes to `main`.
  * **Automated Rollback:** Implement a mechanism to quickly revert to a previous working Docker image version in case of a critical issue in production. This requires tagging Docker images with unique versions (e.g., Git SHA or semantic version) and having a script to deploy a specific tag.
  * **Blue/Green or Canary Deployments:** For zero-downtime deployments and gradual rollouts, investigate advanced deployment strategies using load balancers.
  * **Monitoring and Alerting:**
      * Integrate monitoring tools (e.g., Prometheus, Grafana) to track server health, Docker container performance, and application metrics.
      * Set up alerts (e.g., via PagerDuty, Slack) for critical issues.
      * Utilize Cloudflare Analytics for web traffic insights.
  * **Infrastructure as Code (IaC):** Use tools like Terraform or Pulumi to define and manage your UpCloud server infrastructure programmatically, ensuring consistency and repeatability.
  * **Container Orchestration:** If the application grows in complexity or requires high availability, consider container orchestration platforms like Docker Swarm or Kubernetes.
  * **Centralized Logging:** Implement a logging solution (e.g., ELK Stack, Grafana Loki, Cloudflare Logpush) to collect and analyze application and server logs.

-----

This guide provides a solid foundation for managing the NHS Triage App's deployment and DevOps. Regular review and updates will ensure it remains relevant and useful as the project evolves.