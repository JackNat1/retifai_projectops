#!/usr/bin/env bash

# Get the project root directory
PROJECT_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
cd "$PROJECT_ROOT"

echo "Starting ReTiFai ProjectOps..."

# 1. Start the Backend (runs in background)
if [ -f "./scripts/start_backend.sh" ]; then
    echo "Launching backend..."
    bash ./scripts/start_backend.sh
else
    echo "Error: ./scripts/start_backend.sh not found."
    exit 1
fi

# 2. Start the Frontend (runs in foreground)
echo "Launching frontend..."
npm run dev
