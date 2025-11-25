# Windows PowerShell Deployment Script for Backend (Render)
# Usage: .\deploy-backend.ps1

$ErrorActionPreference = "Stop"

$BACKEND_DIR = ".\backend"

Write-Host "🚀 Starting Backend Deployment to Render..." -ForegroundColor Green

# Step 1: Build Docker images locally for testing
Write-Host "🔨 Building Docker images..." -ForegroundColor Yellow

docker build -t health-assistant-backend:latest -f "$BACKEND_DIR/Dockerfile" "$BACKEND_DIR"
docker build -t health-assistant-rag:latest -f "$BACKEND_DIR/Dockerfile.rag" "$BACKEND_DIR"
docker build -t health-assistant-predict:latest -f "$BACKEND_DIR/Dockerfile.predict" "$BACKEND_DIR"

Write-Host "✅ Docker images built successfully!" -ForegroundColor Green

# Step 2: Push to registry (Render pulls from git)
Write-Host "📤 Pushing code to Git (Render will auto-deploy)..." -ForegroundColor Yellow
git add -A
git commit -m "Deploy backend services - $(Get-Date -Format 'yyyy-MM-dd_HH:mm:ss')" -ErrorAction SilentlyContinue
git push origin main

Write-Host "✅ Backend deployment initiated!" -ForegroundColor Green
Write-Host "📍 Monitor deployment at: https://dashboard.render.com" -ForegroundColor Cyan
