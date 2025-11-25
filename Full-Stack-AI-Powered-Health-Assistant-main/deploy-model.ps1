# Windows PowerShell Model Deployment Script
# Supports: Hugging Face Hub, AWS S3, GitHub LFS
# Usage: .\deploy-model.ps1 -Method huggingface

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("huggingface", "s3", "lfs")]
    [string]$Method
)

$ErrorActionPreference = "Stop"

$MODEL_FILE = "backend/without_handling_dataimbalance_nonlinear3.h5"
$MODEL_SIZE = (Get-Item $MODEL_FILE).Length / 1MB

Write-Host "🤖 Deploying ML Model ($($MODEL_SIZE)MB)..." -ForegroundColor Green

function Deploy-HuggingFace {
    Write-Host "📤 Uploading to Hugging Face Hub..." -ForegroundColor Yellow
    
    # Check if huggingface-hub is installed
    try {
        python -c "import huggingface_hub" 2>$null
    } catch {
        Write-Host "Installing huggingface-hub..." -ForegroundColor Yellow
        pip install huggingface-hub
    }
    
    $REPO_ID = if ($env:HF_REPO_ID) { $env:HF_REPO_ID } else { "your-username/health-assistant-model" }
    
    Write-Host "Uploading to: https://huggingface.co/$REPO_ID" -ForegroundColor Cyan
    huggingface-cli upload-folder $MODEL_FILE --repo-id="$REPO_ID" --repo-type=model
    
    Write-Host "✅ Model uploaded to Hugging Face!" -ForegroundColor Green
    Write-Host "📍 Access at: https://huggingface.co/$REPO_ID" -ForegroundColor Cyan
}

function Deploy-S3 {
    Write-Host "📤 Uploading to AWS S3..." -ForegroundColor Yellow
    
    $BUCKET_NAME = if ($env:AWS_BUCKET) { $env:AWS_BUCKET } else { "health-assistant-models" }
    
    aws s3 cp $MODEL_FILE "s3://$BUCKET_NAME/models/" --region us-east-1
    
    # Generate signed URL
    $SIGNED_URL = aws s3 presign "s3://$BUCKET_NAME/models/$(Split-Path $MODEL_FILE -Leaf)" --expires-in 604800
    
    Write-Host "✅ Model uploaded to S3!" -ForegroundColor Green
    Write-Host "📍 Signed URL (7 days): $SIGNED_URL" -ForegroundColor Cyan
}

function Deploy-LFS {
    Write-Host "📤 Setting up Git LFS..." -ForegroundColor Yellow
    
    git lfs install
    git lfs track "*.h5"
    git add .gitattributes
    
    git add $MODEL_FILE
    git commit -m "Add ML model with Git LFS - $(Get-Date -Format 'yyyy-MM-dd')"
    git push origin main
    
    Write-Host "✅ Model stored with Git LFS!" -ForegroundColor Green
}

# Execute deployment based on method
switch ($Method) {
    "huggingface" { Deploy-HuggingFace }
    "s3" { Deploy-S3 }
    "lfs" { Deploy-LFS }
}
