#!/bin/sh

# Docker entrypoint script to handle environment variables
# This script replaces placeholder values in the built React app with actual environment variables

set -e

# Function to replace environment variables in JavaScript files
replace_env_vars() {
    echo "Replacing environment variables..."
    
    # Find all JavaScript files in the build directory
    find /usr/share/nginx/html -name "*.js" -type f -exec sed -i \
        -e "s|REACT_APP_OPENAI_API_KEY_PLACEHOLDER|${REACT_APP_OPENAI_API_KEY:-}|g" \
        -e "s|REACT_APP_OPENAI_MODEL_PLACEHOLDER|${REACT_APP_OPENAI_MODEL:-gpt-4o}|g" \
        -e "s|REACT_APP_OPENAI_TEMPERATURE_PLACEHOLDER|${REACT_APP_OPENAI_TEMPERATURE:-0.7}|g" \
        {} \;
    
    echo "Environment variables replaced successfully"
}

# Replace environment variables if they exist
if [ -n "$REACT_APP_OPENAI_API_KEY" ] || [ -n "$REACT_APP_OPENAI_MODEL" ] || [ -n "$REACT_APP_OPENAI_TEMPERATURE" ]; then
    replace_env_vars
fi

# Execute the main command
exec "$@"
