#!/bin/bash

# Deployment Script for Frontend (Vercel)
# Usage: ./deploy-frontend.sh

set -e

echo "🚀 Starting Frontend Deployment to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Build the application
echo "🔨 Building application..."
npm run build

# Login to Vercel (if not already logged in)
echo "🔐 Vercel authentication..."
vercel login

# Deploy to production
echo "📤 Deploying to Vercel..."
vercel --prod

echo "✅ Frontend deployment complete!"
echo "📍 Your site is now available at the Vercel URL"
