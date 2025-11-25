#!/bin/bash

# Model Deployment Script
# Supports: Hugging Face Hub, AWS S3, GitHub LFS
# Usage: ./deploy-model.sh [huggingface|s3|lfs]

set -e

MODEL_FILE="backend/without_handling_dataimbalance_nonlinear3.h5"
MODEL_SIZE=$(du -h "$MODEL_FILE" | cut -f1)

echo "🤖 Deploying ML Model ($MODEL_SIZE)..."

deploy_huggingface() {
    echo "📤 Uploading to Hugging Face Hub..."
    
    # Check if huggingface-hub is installed
    python -c "import huggingface_hub" || pip install huggingface-hub
    
    REPO_ID="${HF_REPO_ID:-your-username/health-assistant-model}"
    
    echo "Uploading to: https://huggingface.co/$REPO_ID"
    huggingface-cli upload-folder "$MODEL_FILE" --repo-id="$REPO_ID" --repo-type=model
    
    echo "✅ Model uploaded to Hugging Face!"
    echo "📍 Access at: https://huggingface.co/$REPO_ID"
}

deploy_s3() {
    echo "📤 Uploading to AWS S3..."
    
    BUCKET_NAME="${AWS_BUCKET:-health-assistant-models}"
    
    aws s3 cp "$MODEL_FILE" "s3://$BUCKET_NAME/models/" --region us-east-1
    
    # Generate signed URL
    SIGNED_URL=$(aws s3 presign "s3://$BUCKET_NAME/models/$(basename $MODEL_FILE)" --expires-in 604800)
    
    echo "✅ Model uploaded to S3!"
    echo "📍 Signed URL (7 days): $SIGNED_URL"
}

deploy_lfs() {
    echo "📤 Setting up Git LFS..."
    
    # Check if Git LFS is installed
    git lfs install || (echo "Installing Git LFS..." && brew install git-lfs && git lfs install)
    
    # Track .h5 files
    git lfs track "*.h5"
    git add .gitattributes
    
    # Add model file
    git add "$MODEL_FILE"
    git commit -m "Add ML model with Git LFS - $(date +%Y-%m-%d)"
    git push origin main
    
    echo "✅ Model stored with Git LFS!"
}

# Main deployment logic
if [ "$1" == "huggingface" ]; then
    deploy_huggingface
elif [ "$1" == "s3" ]; then
    deploy_s3
elif [ "$1" == "lfs" ]; then
    deploy_lfs
else
    echo "Usage: ./deploy-model.sh [huggingface|s3|lfs]"
    echo ""
    echo "Examples:"
    echo "  ./deploy-model.sh huggingface  # Upload to Hugging Face Hub"
    echo "  ./deploy-model.sh s3           # Upload to AWS S3"
    echo "  ./deploy-model.sh lfs          # Store with Git LFS"
    exit 1
fi
