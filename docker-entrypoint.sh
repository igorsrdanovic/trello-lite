#!/bin/sh
set -e

# Environment variable substitution for runtime configuration
if [ -n "$API_URL" ]; then
  echo "Configuring API URL: $API_URL"
  # Add any runtime configuration here
fi

# Execute the main command
exec "$@"
