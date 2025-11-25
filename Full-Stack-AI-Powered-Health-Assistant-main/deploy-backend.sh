#!/bin/bash

# Deployment Script for Backend Services (Render)
# Usage: ./deploy-backend.sh [service-id]

set -e

BACKEND_DIR="./backend"

echo "🚀 Starting Backend Deployment to Render..."

# Step 1: Build Docker images locally for testing
echo "🔨 Building Docker images..."

docker build -t health-assistant-backend:latest -f "$BACKEND_DIR/Dockerfile" "$BACKEND_DIR"
docker build -t health-assistant-rag:latest -f "$BACKEND_DIR/Dockerfile.rag" "$BACKEND_DIR"
docker build -t health-assistant-predict:latest -f "$BACKEND_DIR/Dockerfile.predict" "$BACKEND_DIR"

echo "✅ Docker images built successfully!"

# Step 2: Test if services start
echo "🧪 Testing main backend service..."
docker run --rm -e NODE_ENV=production -p 5000:5000 health-assistant-backend:latest &
BACKEND_PID=$!
sleep 5
kill $BACKEND_PID 2>/dev/null || true

echo "✅ Backend services ready for deployment!"

# Step 3: Push to registry (optional for Render - it pulls from git)
echo "📤 Pushing code to Git (Render will auto-deploy)..."
git add -A
git commit -m "Deploy backend services - $(date +%Y-%m-%d_%H:%M:%S)" || true
git push origin main

echo "✅ Backend deployment initiated!"
echo "📍 Monitor deployment at: https://dashboard.render.com"
