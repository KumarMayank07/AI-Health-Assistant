# Windows PowerShell Complete Deployment Script
# Deploys: Frontend + Backend + Model
# Usage: .\deploy-all.ps1

$ErrorActionPreference = "Stop"

Write-Host "🚀 Full Stack Deployment Starting..." -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan

# Step 1: Frontend
Write-Host "`nStep 1: Deploying Frontend..." -ForegroundColor Yellow
if (Test-Path ".\deploy-frontend.ps1") {
    & ".\deploy-frontend.ps1"
    Write-Host "✅ Frontend deployed!" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend deployment script not found" -ForegroundColor Red
}

# Step 2: Backend
Write-Host "`nStep 2: Deploying Backend..." -ForegroundColor Yellow
if (Test-Path ".\deploy-backend.ps1") {
    & ".\deploy-backend.ps1"
    Write-Host "✅ Backend deployed!" -ForegroundColor Green
} else {
    Write-Host "❌ Backend deployment script not found" -ForegroundColor Red
}

# Step 3: Model (optional)
Write-Host "`nStep 3: Deploy ML Model?" -ForegroundColor Yellow
Write-Host "Options:"
Write-Host "  1 = Hugging Face Hub"
Write-Host "  2 = AWS S3"
Write-Host "  3 = Git LFS"
Write-Host "  4 = Skip"

$choice = Read-Host "Enter your choice (1-4)"

switch ($choice) {
    "1" {
        if (Test-Path ".\deploy-model.ps1") {
            & ".\deploy-model.ps1" -Method huggingface
            Write-Host "✅ Model deployed to Hugging Face!" -ForegroundColor Green
        }
    }
    "2" {
        if (Test-Path ".\deploy-model.ps1") {
            & ".\deploy-model.ps1" -Method s3
            Write-Host "✅ Model deployed to S3!" -ForegroundColor Green
        }
    }
    "3" {
        if (Test-Path ".\deploy-model.ps1") {
            & ".\deploy-model.ps1" -Method lfs
            Write-Host "✅ Model stored with Git LFS!" -ForegroundColor Green
        }
    }
    "4" {
        Write-Host "Skipping model deployment" -ForegroundColor Yellow
    }
    default {
        Write-Host "Invalid choice" -ForegroundColor Red
    }
}

Write-Host "`n==========================================" -ForegroundColor Cyan
Write-Host "✅ Full Stack Deployment Complete!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📍 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Visit your Vercel dashboard to confirm frontend is live"
Write-Host "2. Check Render dashboard for backend services"
Write-Host "3. Update your frontend environment variables if needed"
Write-Host "4. Test all API endpoints"
