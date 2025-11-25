# Windows PowerShell Deployment Script for Frontend (Vercel)
# Usage: .\deploy-frontend.ps1

$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting Frontend Deployment to Vercel..." -ForegroundColor Green

# Check if Vercel CLI is installed
try {
    vercel --version | Out-Null
} catch {
    Write-Host "📦 Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

# Build the application
Write-Host "🔨 Building application..." -ForegroundColor Yellow
npm run build

# Login to Vercel
Write-Host "🔐 Vercel authentication..." -ForegroundColor Yellow
vercel login

# Deploy to production
Write-Host "📤 Deploying to Vercel..." -ForegroundColor Yellow
vercel --prod

Write-Host "✅ Frontend deployment complete!" -ForegroundColor Green
Write-Host "📍 Your site is now available at the Vercel URL" -ForegroundColor Cyan
