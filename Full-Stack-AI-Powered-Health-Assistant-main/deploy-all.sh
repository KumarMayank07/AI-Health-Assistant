#!/bin/bash

# Complete Deployment Script
# Deploys: Frontend + Backend + Model
# Usage: ./deploy-all.sh

set -e

echo "🚀 Full Stack Deployment Starting..."
echo "=========================================="

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Frontend
echo -e "\n${YELLOW}Step 1: Deploying Frontend...${NC}"
if [ -f "./deploy-frontend.sh" ]; then
    chmod +x ./deploy-frontend.sh
    ./deploy-frontend.sh
    echo -e "${GREEN}✅ Frontend deployed!${NC}"
else
    echo -e "${RED}❌ Frontend deployment script not found${NC}"
fi

# Step 2: Backend
echo -e "\n${YELLOW}Step 2: Deploying Backend...${NC}"
if [ -f "./deploy-backend.sh" ]; then
    chmod +x ./deploy-backend.sh
    ./deploy-backend.sh
    echo -e "${GREEN}✅ Backend deployed!${NC}"
else
    echo -e "${RED}❌ Backend deployment script not found${NC}"
fi

# Step 3: Model (optional)
echo -e "\n${YELLOW}Step 3: Deploy ML Model?${NC}"
read -p "Deploy model to (1=Hugging Face, 2=S3, 3=Git LFS, 4=Skip)? " choice

case $choice in
    1)
        if [ -f "./deploy-model.sh" ]; then
            chmod +x ./deploy-model.sh
            ./deploy-model.sh huggingface
            echo -e "${GREEN}✅ Model deployed to Hugging Face!${NC}"
        fi
        ;;
    2)
        if [ -f "./deploy-model.sh" ]; then
            chmod +x ./deploy-model.sh
            ./deploy-model.sh s3
            echo -e "${GREEN}✅ Model deployed to S3!${NC}"
        fi
        ;;
    3)
        if [ -f "./deploy-model.sh" ]; then
            chmod +x ./deploy-model.sh
            ./deploy-model.sh lfs
            echo -e "${GREEN}✅ Model stored with Git LFS!${NC}"
        fi
        ;;
    4)
        echo "Skipping model deployment"
        ;;
    *)
        echo "Invalid choice"
        ;;
esac

echo -e "\n${GREEN}=========================================="
echo "✅ Full Stack Deployment Complete!"
echo "==========================================${NC}"
echo ""
echo "📍 Next Steps:"
echo "1. Visit your Vercel dashboard to confirm frontend is live"
echo "2. Check Render dashboard for backend services"
echo "3. Update your frontend environment variables if needed"
echo "4. Test all API endpoints"
echo ""
