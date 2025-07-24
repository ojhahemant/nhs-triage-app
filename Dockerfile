# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Define build arguments
ARG REACT_APP_OPENAI_API_KEY
ARG REACT_APP_OPENAI_MODEL=gpt-4o
ARG REACT_APP_OPENAI_TEMPERATURE=0.7

# Set environment variables for the build
ENV REACT_APP_OPENAI_API_KEY=${REACT_APP_OPENAI_API_KEY}
ENV REACT_APP_OPENAI_MODEL=${REACT_APP_OPENAI_MODEL}
ENV REACT_APP_OPENAI_TEMPERATURE=${REACT_APP_OPENAI_TEMPERATURE}

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built application from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:80/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]