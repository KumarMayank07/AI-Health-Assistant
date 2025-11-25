# 🚀 Full Stack Deployment - Complete Step-by-Step Guide

**Last Updated**: November 25, 2025  
**Status**: Ready for Production Deployment

---

## 📋 What Was Prepared

### ✅ Configuration Files Created

1. **.env.production** - Frontend environment variables
2. **backend/.env.production** - Backend environment variables
3. **backend/rag_service/.env.production** - RAG service environment variables
4. **backend/.env.predict.production** - Predict service environment variables
5. **vercel.json** - Vercel deployment configuration
6. **render.yaml** - Render deployment configuration (all 3 services)
7. **Procfile** - Heroku/Render process configuration

### ✅ Docker Files Created

1. **backend/Dockerfile** - Main Node.js backend
2. **backend/Dockerfile.rag** - FastAPI RAG service
3. **backend/Dockerfile.predict** - Python ML prediction service

### ✅ Deployment Scripts

1. **deploy-frontend.ps1** - Windows PowerShell frontend deployment
2. **deploy-backend.ps1** - Windows PowerShell backend deployment
3. **deploy-model.ps1** - Windows PowerShell model deployment
4. **deploy-all.ps1** - Windows PowerShell full stack deployment
5. Plus bash versions of all scripts

### ✅ CI/CD Pipeline

1. **.github/workflows/deploy.yml** - GitHub Actions automation
   - Auto-builds and deploys on push to main
   - Runs security scans
   - Tests all components

### ✅ Documentation

1. **DEPLOYMENT_GUIDE.md** - Comprehensive guide (50+ sections)
2. **DEPLOYMENT_COMMANDS.md** - Quick reference for all commands
3. **PRE_DEPLOYMENT_CHECKLIST.md** - 100+ item checklist

### ✅ Code Updates

1. **backend/server.js** - Updated CORS for production environments

---

## 🎯 Quick Start - Choose Your Path

### 🏃 **Express Lane** (5 minutes)

Use automated scripts for quick deployment

```powershell
.\deploy-all.ps1
```

### 👨‍💻 **Manual Lane** (15 minutes)

Follow step-by-step manual instructions below

### 🧙 **Expert Lane** (20 minutes)

Configure everything via web dashboards (full control)

---

## 🚀 EXPRESS DEPLOYMENT (Automated)

### Prerequisites

```powershell
# 1. Git installed and authenticated
git config user.email "you@example.com"
git config user.name "Your Name"

# 2. Node.js 18+
node --version

# 3. Docker installed (for local testing)
docker --version

# 4. Push code to GitHub
git push origin main
```

### One Command Deployment

```powershell
# Windows PowerShell - Run from project root
cd Full-Stack-AI-Powered-Health-Assistant-main
.\deploy-all.ps1

# Or Linux/Mac Bash
./deploy-all.sh
```

This script will:

1. Build and deploy frontend to Vercel
2. Build Docker images
3. Deploy backend services to Render
4. Prompt for model deployment method

---

## 👨‍💻 STEP-BY-STEP MANUAL DEPLOYMENT

### Step 1️⃣ : Setup MongoDB (2 minutes)

```bash
# 1. Go to https://www.mongodb.com/cloud/atlas
# 2. Sign up (free)
# 3. Create a project
# 4. Create a cluster (M0 free tier)
# 5. Create a database user
#    - Username: healthdb_user
#    - Generate password: copy the secure one
# 6. Get connection string
#    - Format: mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true

# SAVE THIS: Your MongoDB URI
# Example: mongodb+srv://healthdb_user:xK9mP2nL@cluster0.mongodb.net/health_db
```

### Step 2️⃣ : Setup API Keys (5 minutes)

**Google Gemini API:**

```
1. Go to https://cloud.google.com/
2. Create project
3. Enable Gemini API
4. Create API key
5. SAVE: Your API key
```

**Cloudinary:**

```
1. Go to https://cloudinary.com/
2. Sign up (free tier)
3. Go to dashboard
4. Note your: Cloud Name, API Key, API Secret
5. SAVE: All three credentials
```

### Step 3️⃣ : Prepare Environment Files (3 minutes)

**Update `.env.production`:**

```bash
# File: .env.production
VITE_API_URL=https://your-backend.render.com/api
VITE_RAG_API_URL=https://your-rag-service.render.com/api/rag
VITE_PREDICT_API_URL=https://your-predict-service.render.com

# Don't have URLs yet? Use placeholders, update after deployment
```

**Update `backend/.env.production`:**

```bash
# File: backend/.env.production
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname
JWT_SECRET_KEY=generate-a-random-string-here-min-32-chars
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GOOGLE_GENAI_API_KEY=your_google_gemini_key
RAG_SERVICE_URL=https://your-rag-service.render.com
PREDICT_SERVICE_URL=https://your-predict-service.render.com
FRONTEND_URL=https://your-frontend.vercel.app
```

**Update `backend/rag_service/.env.production`:**

```bash
NODE_ENV=production
PORT=8001
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname
GOOGLE_GENAI_API_KEY=your_google_gemini_key
JWT_SECRET_KEY=same-as-backend-jwt-secret
ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://your-backend.render.com
```

**Update `backend/.env.predict.production`:**

```bash
NODE_ENV=production
PORT=8002
MODEL_PATH=/app/without_handling_dataimbalance_nonlinear3.h5
ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://your-backend.render.com
```

### Step 4️⃣ : Deploy Frontend to Vercel (5 minutes)

**Option A: Via Vercel CLI**

```powershell
# Install CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

**Option B: Via Vercel Dashboard** (Recommended first time)

```
1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Select "Import Git Repository"
4. Choose your GitHub repo
5. Configure:
   - Framework: Vite
   - Build Command: npm run build
   - Output Directory: dist
6. Add Environment Variables:
   - VITE_API_URL = https://your-backend.render.com/api
   - VITE_RAG_API_URL = https://your-rag-service.render.com/api/rag
   - VITE_PREDICT_API_URL = https://your-predict-service.render.com
7. Click "Deploy"
```

**✅ Frontend URL**: https://your-project.vercel.app

### Step 5️⃣ : Deploy Backend to Render (10 minutes)

**Option A: Using render.yaml** (Recommended)

```bash
# The render.yaml file is already created
# Just push to GitHub and Render detects it

git add render.yaml
git commit -m "Add Render configuration"
git push origin main

# Then:
# 1. Go to https://dashboard.render.com/blueprints
# 2. Click "New Blueprint"
# 3. Select your repository
# 4. Configure environment:
#    - Add all MongoDB, API keys, etc.
# 5. Click "Deploy"
```

**Option B: Manual Service Creation**

```
1. Go to https://dashboard.render.com
2. Click "New+" → "Web Service"

For Backend Service:
  - Name: health-assistant-backend
  - Branch: main
  - Runtime: Node
  - Build Command: npm install
  - Start Command: npm start
  - Plan: Standard ($12/month)
  - Environment Variables: [Add from backend/.env.production]
  - Deploy

For RAG Service:
  - Name: health-assistant-rag
  - Branch: main
  - Runtime: Docker
  - Dockerfile Path: backend/Dockerfile.rag
  - Plan: Standard ($12/month)
  - Environment Variables: [Add from backend/rag_service/.env.production]
  - Deploy

For Predict Service:
  - Name: health-assistant-predict
  - Branch: main
  - Runtime: Docker
  - Dockerfile Path: backend/Dockerfile.predict
  - Plan: Standard ($12/month)
  - Environment Variables: [Add from backend/.env.predict.production]
  - Deploy
```

**✅ Backend URLs:**

- Main: https://health-assistant-backend.render.com
- RAG: https://health-assistant-rag.render.com
- Predict: https://health-assistant-predict.render.com

### Step 6️⃣ : Deploy ML Model (5 minutes - Choose One)

**Option A: Hugging Face Hub (Easiest)**

```powershell
# 1. Go to https://huggingface.co and create account
# 2. Generate access token

# 3. Deploy model
.\deploy-model.ps1 -Method huggingface

# 4. Access at: https://huggingface.co/your-username/health-assistant-model
```

**Option B: AWS S3**

```powershell
# 1. Create S3 bucket
# 2. Configure AWS CLI

# 3. Deploy model
.\deploy-model.ps1 -Method s3

# 4. Use signed URL in your services
```

**Option C: Git LFS (Included in Docker)**

```powershell
# Model automatically included in Docker images

.\deploy-model.ps1 -Method lfs
```

### Step 7️⃣ : Update Frontend URLs (2 minutes)

After services are deployed, get their URLs and update Vercel:

```
1. Go to Vercel Dashboard
2. Select your project
3. Settings → Environment Variables
4. Update:
   - VITE_API_URL = [Render backend URL]
   - VITE_RAG_API_URL = [Render RAG URL]
   - VITE_PREDICT_API_URL = [Render Predict URL]
5. Click "Save"
6. Redeploy: Deployments → [Latest] → Redeploy
```

### Step 8️⃣ : Test Everything (5 minutes)

```bash
# Test Frontend
curl https://your-frontend.vercel.app

# Test Backend
curl https://health-assistant-backend.render.com/api/health

# Test RAG Service
curl https://health-assistant-rag.render.com/

# Test Predict Service (if it has health endpoint)
curl https://health-assistant-predict.render.com/health
```

---

## 🧙 EXPERT DASHBOARD CONFIGURATION

For complete control via web interfaces:

### Vercel Dashboard

```
https://vercel.com/dashboard
├── New Project
├── Import Git Repository
├── Configure Build Settings
├── Add Environment Variables
├── Custom Domains
├── Monitor Deployments
└── View Logs
```

### Render Dashboard

```
https://dashboard.render.com
├── New Service
├── Connect GitHub
├── Configure Environment
├── Manage PostgreSQL/Redis (if needed)
├── View Logs
└── Manage Custom Domains
```

### MongoDB Atlas

```
https://cloud.mongodb.com
├── Create Cluster
├── Configure Security
├── Create Database User
├── Get Connection String
├── Monitor Performance
└── Set Up Backups
```

---

## 📊 Architecture After Deployment

```
┌─────────────────────────────────┐
│  Frontend (Vercel)              │
│  your-project.vercel.app        │
└──────────────┬──────────────────┘
               │ API Calls
    ┌──────────┼──────────┐
    │          │          │
    ▼          ▼          ▼
┌────────┐ ┌────────┐ ┌────────┐
│Backend │ │RAG     │ │Predict │
│Render  │ │Render  │ │Render  │
└────────┘ └────────┘ └────────┘
    │          │          │
    └──────────┼──────────┘
               │
               ▼
         ┌──────────────┐
         │MongoDB Atlas │
         │   (shared)   │
         └──────────────┘
```

---

## ✅ Post-Deployment Verification

### Checklist

- [ ] Frontend loads at https://your-frontend.vercel.app
- [ ] Backend responds at https://your-backend.render.com/api/health
- [ ] RAG service responds at https://your-rag-service.render.com/
- [ ] Can login with test user
- [ ] Chat functionality works
- [ ] Predictions work
- [ ] Image uploads work
- [ ] No console errors in browser
- [ ] No errors in service logs

### View Logs

**Vercel:**

```
1. Go to vercel.com/dashboard
2. Select project
3. Click "Deployments"
4. Select latest deployment
5. Click "Logs"
```

**Render:**

```
1. Go to dashboard.render.com
2. Select service
3. Click "Logs" tab
4. View real-time logs
```

---

## 🐛 Common Issues & Fixes

| Issue                            | Solution                                                  |
| -------------------------------- | --------------------------------------------------------- |
| **CORS errors**                  | Update CORS origins in server.js with production URLs     |
| **Frontend can't reach backend** | Check environment variables, verify URLs                  |
| **MongoDB connection fails**     | Verify connection string, check IP whitelist in Atlas     |
| **Model not found**              | Ensure model path correct in Docker, check if file exists |
| **Services crash on startup**    | Check logs, verify environment variables are set          |
| **Memory issues**                | Consider upgrading Render plan                            |
| **Rate limiting errors**         | Check rate limiter settings in server.js                  |

---

## 📊 Cost Breakdown

| Service         | Tier        | Price         |
| --------------- | ----------- | ------------- |
| Vercel Frontend | Free        | $0            |
| Render Backend  | Standard    | $12/mo        |
| Render RAG      | Standard    | $12/mo        |
| Render Predict  | Standard    | $12/mo        |
| MongoDB Atlas   | M0          | Free          |
| **Total**       | **Minimum** | **$36/month** |

---

## 🔄 Continuous Updates

Any time you push to `main` branch:

1. GitHub Actions runs tests
2. Vercel auto-deploys frontend
3. Render auto-deploys backend services
4. No manual action needed!

```bash
# To deploy updates:
git push origin main
# That's it! Everything deploys automatically
```

---

## 📱 Access Your Application

| Component           | URL                                             |
| ------------------- | ----------------------------------------------- |
| **Frontend**        | https://your-project.vercel.app                 |
| **Backend API**     | https://health-assistant-backend.render.com/api |
| **RAG Service**     | https://health-assistant-rag.render.com         |
| **Predict Service** | https://health-assistant-predict.render.com     |
| **MongoDB**         | https://cloud.mongodb.com/v2/...                |

---

## 🎓 Next Steps

1. **Monitoring Setup**

   - Set up error tracking (Sentry)
   - Set up monitoring (Datadog, New Relic)
   - Configure alerts

2. **Custom Domain**

   - Buy domain (GoDaddy, Namecheap, etc.)
   - Point to Vercel frontend
   - Set up SSL

3. **Backup & Recovery**

   - Schedule MongoDB backups
   - Document recovery procedure
   - Test restore process

4. **Performance Optimization**

   - Enable caching
   - Optimize images
   - Set up CDN

5. **Security Hardening**
   - Rotate API keys regularly
   - Implement 2FA
   - Regular security audits

---

## 🆘 Support & Help

| Resource     | Link                     |
| ------------ | ------------------------ |
| Vercel Docs  | https://vercel.com/docs  |
| Render Docs  | https://render.com/docs  |
| MongoDB Docs | https://docs.mongodb.com |
| Docker Docs  | https://docs.docker.com  |
| Node.js Docs | https://nodejs.org/docs  |

---

## 📞 Deployment Status Tracker

Use this to track your deployment progress:

```
Start Time: ________________
Frontend Deployed: [ ] Time: ________________
Backend Deployed: [ ] Time: ________________
RAG Deployed: [ ] Time: ________________
Predict Deployed: [ ] Time: ________________
Model Deployed: [ ] Time: ________________
All Tests Passed: [ ] Time: ________________
End Time: ________________
Total Duration: ________________
```

---

## ✨ You're All Set!

Your application is now ready for production deployment. All configuration, scripts, and documentation have been prepared.

**Choose your deployment method above and follow the steps!**

### Questions?

- Check DEPLOYMENT_COMMANDS.md for command reference
- Check DEPLOYMENT_GUIDE.md for detailed explanations
- Check PRE_DEPLOYMENT_CHECKLIST.md for verification steps

**Good luck with your deployment! 🚀**
