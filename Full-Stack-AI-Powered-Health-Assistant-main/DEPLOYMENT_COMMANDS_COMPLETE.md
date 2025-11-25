# 📋 Complete Deployment Commands Reference

**All commands you need for full-stack deployment**

---

## 🚀 ONE-COMMAND DEPLOYMENT (Express Lane)

### Windows (Recommended)

```powershell
# From project root directory
cd Full-Stack-AI-Powered-Health-Assistant-main
.\deploy-all.ps1
```

This single command:
✅ Builds frontend for Vercel  
✅ Builds Docker images for backend services  
✅ Tests services locally  
✅ Pushes code to GitHub  
✅ Prompts for model deployment method  
✅ Provides status updates

---

## 📦 STEP-BY-STEP COMMANDS (Manual Lane)

### Step 1: Frontend Deployment to Vercel

#### Using Deployment Script

```powershell
# Windows PowerShell
.\deploy-frontend.ps1

# Linux/Mac Bash
./deploy-frontend.sh
```

#### Using Vercel CLI Directly

```powershell
# Install Vercel CLI (one time only)
npm install -g vercel

# Build application
npm run build

# Login to Vercel (first time only)
vercel login

# Deploy to production
vercel --prod

# Force redeploy
vercel --prod --force
```

#### Using Git Integration (Most Automated)

```bash
# Just commit and push - Vercel auto-deploys
git add .
git commit -m "Deploy frontend to Vercel"
git push origin main
# Check Vercel dashboard for deployment status
```

---

### Step 2: Backend Deployment to Render

#### Using Deployment Script

```powershell
# Windows PowerShell
.\deploy-backend.ps1

# Linux/Mac Bash
./deploy-backend.sh
```

#### Using Render Blueprint (Recommended)

```bash
# The render.yaml file is already created
# Just push to GitHub:
git add render.yaml
git commit -m "Add Render configuration"
git push origin main

# Then:
# 1. Go to https://dashboard.render.com/blueprints
# 2. Click "New Blueprint"
# 3. Select your repository
# 4. Click "Deploy"
```

#### Manual Service Creation

**Create Main Backend Service:**

```bash
# 1. Go to https://dashboard.render.com
# 2. Click "New+" → "Web Service"
# 3. Connect GitHub repository
# 4. Configure:

Build Command: npm install
Start Command: npm start
Plan: Standard ($12/month)
Environment: Node 18

# 5. Add Environment Variables (from backend/.env.production):
NODE_ENV=production
PORT=10000
MONGODB_URI=your_connection_string
JWT_SECRET_KEY=your_secret
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
GOOGLE_GENAI_API_KEY=your_key
RAG_SERVICE_URL=https://your-rag-service.render.com
PREDICT_SERVICE_URL=https://your-predict-service.render.com
FRONTEND_URL=https://your-frontend.vercel.app

# 6. Click "Deploy"
```

**Create RAG Service:**

```bash
# 1. Go to https://dashboard.render.com
# 2. Click "New+" → "Web Service"
# 3. Connect GitHub repository
# 4. Configure:

Runtime: Docker
Dockerfile Path: backend/Dockerfile.rag
Plan: Standard ($12/month)

# 5. Add Environment Variables (from backend/rag_service/.env.production):
NODE_ENV=production
PORT=8001
MONGODB_URI=your_connection_string
GOOGLE_GENAI_API_KEY=your_key
JWT_SECRET_KEY=your_secret
ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://your-backend.render.com

# 6. Click "Deploy"
```

**Create Predict Service:**

```bash
# 1. Go to https://dashboard.render.com
# 2. Click "New+" → "Web Service"
# 3. Connect GitHub repository
# 4. Configure:

Runtime: Docker
Dockerfile Path: backend/Dockerfile.predict
Plan: Standard ($12/month)

# 5. Add Environment Variables (from backend/.env.predict.production):
NODE_ENV=production
PORT=8002
MODEL_PATH=/app/without_handling_dataimbalance_nonlinear3.h5
ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://your-backend.render.com

# 6. Click "Deploy"
```

---

### Step 3: Model Deployment

#### Using Deployment Script

**To Hugging Face Hub:**

```powershell
.\deploy-model.ps1 -Method huggingface
```

**To AWS S3:**

```powershell
.\deploy-model.ps1 -Method s3
```

**Using Git LFS:**

```powershell
.\deploy-model.ps1 -Method lfs
```

#### Using Direct Commands

**Hugging Face Hub:**

```bash
# Install huggingface-hub
pip install huggingface-hub

# Login to Hugging Face
huggingface-cli login

# Create new model repository on https://huggingface.co/new
# Then upload model:
huggingface-cli upload-folder ./backend --repo-id=your-username/health-assistant-model --repo-type=model

# Your model: https://huggingface.co/your-username/health-assistant-model
```

**AWS S3:**

```bash
# Configure AWS CLI (one time)
aws configure

# Upload model to S3
aws s3 cp backend/without_handling_dataimbalance_nonlinear3.h5 s3://your-bucket/models/

# Generate signed URL (valid for 7 days)
aws s3 presign s3://your-bucket/models/without_handling_dataimbalance_nonlinear3.h5 --expires-in 604800

# Output: Use this URL in your services
```

**Git LFS:**

```bash
# Install Git LFS (one time)
git lfs install

# Track .h5 files with LFS
git lfs track "*.h5"

# Commit tracking file
git add .gitattributes
git commit -m "Setup Git LFS for model files"

# Add and commit model
git add backend/without_handling_dataimbalance_nonlinear3.h5
git commit -m "Add ML model with Git LFS"

# Push to GitHub
git push origin main

# Model is now stored with Git LFS
# Docker builds will have access to the model
```

---

## 🔧 LOCAL TESTING COMMANDS

### Build Docker Images

```powershell
# Backend service
docker build -t health-assistant-backend:latest -f backend/Dockerfile backend/

# RAG service
docker build -t health-assistant-rag:latest -f backend/Dockerfile.rag backend/

# Predict service
docker build -t health-assistant-predict:latest -f backend/Dockerfile.predict backend/
```

### Run Docker Containers Locally

```powershell
# Backend (port 5000)
docker run -p 5000:5000 -e NODE_ENV=production health-assistant-backend:latest

# RAG (port 8001)
docker run -p 8001:8001 -e NODE_ENV=production health-assistant-rag:latest

# Predict (port 8002)
docker run -p 8002:8002 health-assistant-predict:latest
```

### Test Services Are Running

```bash
# Backend health check
curl http://localhost:5000/api/health

# RAG service check
curl http://localhost:8001/

# Predict service check
curl http://localhost:8002/health
```

---

## 🌍 ENVIRONMENT SETUP COMMANDS

### Create Environment Files

**Frontend (.env.production):**

```bash
echo "VITE_API_URL=https://your-backend.render.com/api" > .env.production
echo "VITE_RAG_API_URL=https://your-rag-service.render.com/api/rag" >> .env.production
echo "VITE_PREDICT_API_URL=https://your-predict-service.render.com" >> .env.production
```

**Backend (backend/.env.production):**

```bash
echo "NODE_ENV=production" > backend/.env.production
echo "PORT=10000" >> backend/.env.production
echo "MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname" >> backend/.env.production
echo "JWT_SECRET_KEY=your_secret_key_here" >> backend/.env.production
# ... add other variables
```

### Generate Secure JWT Secret

```powershell
# Windows PowerShell
$secret = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString() + (New-Guid).ToString()))
Write-Host "JWT_SECRET_KEY=$secret"

# Linux/Mac
openssl rand -base64 32
```

---

## 📊 VERIFICATION COMMANDS

### Test Production URLs

```bash
# Frontend
curl -I https://your-project.vercel.app

# Backend API
curl -I https://health-assistant-backend.render.com/api/health

# RAG Service
curl -I https://health-assistant-rag.render.com/

# Predict Service
curl -I https://health-assistant-predict.render.com/health
```

### Test API Endpoints

```bash
# Login endpoint
curl -X POST https://health-assistant-backend.render.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Chat endpoint
curl -X POST https://health-assistant-rag.render.com/api/rag/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello"}'

# Predict endpoint
curl -X POST https://health-assistant-predict.render.com/predict \
  -H "Content-Type: application/json" \
  -d '{"data":"..."}'
```

### Check Service Logs

```bash
# Vercel logs (web dashboard only)
# https://vercel.com/dashboard → Select project → Deployments

# Render logs (web dashboard)
# https://dashboard.render.com → Select service → Logs

# Or via Render CLI:
render logs --service-id=your-service-id
```

---

## 🔄 CONTINUOUS UPDATES

### Deploy Updates to Production

```bash
# Make changes locally
git add .
git commit -m "Update: description of changes"
git push origin main

# Automatic deployment triggered!
# Check dashboards:
# - Frontend: https://vercel.com/dashboard
# - Backend: https://dashboard.render.com
```

### Redeploy Without Changes

```powershell
# Vercel redeploy
vercel --prod --force

# Render redeploy (via dashboard)
# Go to service → Scroll to top → Click "Manual Deploy" → "Deploy latest commit"
```

---

## 📦 SETUP MONGODB

### Create MongoDB Cluster

```
1. Go to https://www.mongodb.com/cloud/atlas
2. Create Account (free)
3. Create Project
4. Build Cluster (M0 free tier)
5. Create Database User
6. Get Connection String
```

### Connection String Format

```
mongodb+srv://username:password@cluster-name.mongodb.net/database-name?retryWrites=true&w=majority
```

### Test MongoDB Connection

```bash
# Using mongosh (MongoDB shell)
mongosh "mongodb+srv://username:password@cluster.mongodb.net/dbname"

# Once connected, try:
show dbs
show collections
```

---

## 🔐 MANAGE SECRETS & CREDENTIALS

### Set Vercel Environment Variables (CLI)

```bash
vercel env add VITE_API_URL
# Prompts for value, select: Production

vercel env add VITE_RAG_API_URL
vercel env add VITE_PREDICT_API_URL
```

### Set Render Environment Variables (API)

```bash
# Use Render CLI or dashboard
# Dashboard is simpler for first time

# CLI approach:
render env set SERVICE_ID VARIABLE_NAME value
```

### Rotate API Keys (Security Best Practice)

```bash
# Every 3 months, regenerate:
# 1. JWT_SECRET_KEY (requires updating backend env)
# 2. Google Gemini API key
# 3. Cloudinary API secret
# 4. MongoDB password

# Update in all three places:
# - .env.production files
# - Service environment variables
# - Application restarts automatically
```

---

## 🆘 TROUBLESHOOTING COMMANDS

### Frontend Build Issues

```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build

# Check for errors
npm run lint
```

### Backend Docker Issues

```bash
# Rebuild Docker image
docker build -t health-assistant-backend:latest -f backend/Dockerfile backend/ --no-cache

# Check Docker logs
docker logs <container-id>

# Remove failed container
docker rm <container-id>
```

### Database Connection Issues

```bash
# Test MongoDB connection string
mongosh "your-mongodb-uri"

# Check IP whitelist
# Go to MongoDB Atlas → Network Access → IP Whitelist

# Common fix:
# Add 0.0.0.0/0 to allow all IPs (development)
# Or add specific IPs (production)
```

### CORS Issues

```bash
# Check CORS headers
curl -I -H "Origin: https://your-frontend.vercel.app" \
  https://health-assistant-backend.render.com/api/health

# Update backend CORS in server.js
# Restart service after updating
```

---

## 📈 MONITORING & HEALTH CHECKS

### Check All Services Health

```bash
#!/bin/bash
# Save as check-health.sh

echo "🔍 Checking service health..."

echo "Frontend:"
curl -I https://your-project.vercel.app 2>/dev/null | head -1

echo "Backend:"
curl -I https://health-assistant-backend.render.com/api/health 2>/dev/null | head -1

echo "RAG:"
curl -I https://health-assistant-rag.render.com/ 2>/dev/null | head -1

echo "Predict:"
curl -I https://health-assistant-predict.render.com/health 2>/dev/null | head -1

echo "MongoDB:"
mongosh "your-mongodb-uri" --eval "db.version()" 2>/dev/null | grep "version"

echo "✅ Health check complete"
```

### View Real-Time Logs

```bash
# Render CLI (monitor live logs)
render logs --service-id=health-assistant-backend --tail

# Or use dashboards:
# Vercel: https://vercel.com/dashboard
# Render: https://dashboard.render.com
```

---

## 💾 DATABASE BACKUP & RESTORE

### MongoDB Backup (Manual)

```bash
# Export database
mongodump --uri "your-mongodb-uri" --out ./backup

# Import database
mongorestore --uri "your-mongodb-uri" ./backup/dbname
```

### MongoDB Automated Backups

```
1. MongoDB Atlas Dashboard
2. Select Cluster
3. Backup → Enable "Continuous Backup"
4. Automatic daily snapshots enabled
```

---

## 🔗 USEFUL SHORTCUT COMMANDS

### Quick Status Check

```bash
# Check deployment status of all services
# Create this alias:
alias deploy-status='echo "Frontend: https://vercel.com/dashboard" && echo "Backend: https://dashboard.render.com" && echo "Database: https://cloud.mongodb.com"'

deploy-status
```

### Quick URLs

```bash
# Set these environment variables for quick access:
export FRONTEND_URL="https://your-project.vercel.app"
export BACKEND_URL="https://health-assistant-backend.render.com"
export RAG_URL="https://health-assistant-rag.render.com"
export PREDICT_URL="https://health-assistant-predict.render.com"

# Then use:
curl $FRONTEND_URL
curl $BACKEND_URL/api/health
```

---

## 📱 FINAL DEPLOYMENT CHECKLIST COMMANDS

```bash
# 1. Verify code is ready
npm run lint

# 2. Build frontend
npm run build

# 3. Build Docker images
docker build -t health-assistant-backend:latest -f backend/Dockerfile backend/
docker build -t health-assistant-rag:latest -f backend/Dockerfile.rag backend/
docker build -t health-assistant-predict:latest -f backend/Dockerfile.predict backend/

# 4. Push to GitHub
git add .
git commit -m "Prepare for production deployment"
git push origin main

# 5. Deploy!
.\deploy-all.ps1

# 6. Verify all services
curl https://your-project.vercel.app
curl https://health-assistant-backend.render.com/api/health
curl https://health-assistant-rag.render.com/
curl https://health-assistant-predict.render.com/health

echo "✅ Deployment complete!"
```

---

## 🎯 COMMAND QUICK REFERENCE

| Task            | Command                                        |
| --------------- | ---------------------------------------------- |
| Deploy All      | `.\deploy-all.ps1`                             |
| Deploy Frontend | `.\deploy-frontend.ps1`                        |
| Deploy Backend  | `.\deploy-backend.ps1`                         |
| Deploy Model    | `.\deploy-model.ps1 -Method huggingface`       |
| Build Docker    | `docker build -t image:latest -f Dockerfile .` |
| Test Frontend   | `npm run build`                                |
| Test Services   | `curl http://localhost:5000/api/health`        |
| Git Push        | `git push origin main`                         |
| Check Logs      | Go to service dashboard                        |
| Generate Secret | `openssl rand -base64 32`                      |

---

## 🚀 You're All Set!

All commands are ready to use. Start with:

```powershell
.\deploy-all.ps1
```

Or follow the step-by-step guide in QUICK_START_DEPLOYMENT.md

**Good luck! 🎉**
