#!/usr/bin/env bash
# Get the project root directory
PROJECT_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
cd "$PROJECT_ROOT"
pkill -f "uvicorn backend.app.main:app" || true

nohup ./venv/bin/python3 -m uvicorn backend.app.main:app \
  --host 0.0.0.0 \
  --port 8000 \
  > uvicorn.log 2>&1 &

echo "Backend started on http://localhost:8000"
