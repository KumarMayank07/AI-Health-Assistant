# 🚀 Deployment Quick Commands Reference

## ⚡ Quick Start - All in One

### Windows (PowerShell)

```powershell
# Make sure you're in the project root directory
cd Full-Stack-AI-Powered-Health-Assistant-main

# Deploy everything at once
.\deploy-all.ps1
```

### Linux/Mac (Bash)

```bash
cd Full-Stack-AI-Powered-Health-Assistant-main
chmod +x deploy-all.sh
./deploy-all.sh
```

---

## 📦 Frontend Deployment (Vercel)

### Quick Deploy (Windows PowerShell)

```powershell
.\deploy-frontend.ps1
```

### Manual Vercel Deployment

```powershell
# Install Vercel CLI
npm install -g vercel

# Build the app
npm run build

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### Deploy via GitHub (Recommended)

1. Push code to GitHub
2. Go to https://vercel.com/new
3. Import repository
4. Configure:
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add Environment Variables:
   - `VITE_API_URL` = `https://your-backend.render.com/api`
   - `VITE_RAG_API_URL` = `https://your-rag-service.render.com/api/rag`
   - `VITE_PREDICT_API_URL` = `https://your-predict-service.render.com`
6. Deploy

### Deploy via Vercel Dashboard

```
https://vercel.com/dashboard → Add New Project → Import Git Repository
```

---

## 🔌 Backend Deployment (Render)

### Quick Deploy (Windows PowerShell)

```powershell
.\deploy-backend.ps1
```

### Manual Render Deployment Steps

#### Option 1: Using render.yaml (Recommended)

```powershell
# Push your code with render.yaml file
git add render.yaml
git commit -m "Add Render configuration"
git push origin main

# Go to https://dashboard.render.com
# Click New → Blueprint → Select repository → Deploy
```

#### Option 2: Create Services Manually

**Main Backend Service:**

```powershell
# 1. Go to https://dashboard.render.com
# 2. Click "New +" → "Web Service"
# 3. Configure:
#    - Name: health-assistant-backend
#    - Environment: Node
#    - Build: npm install
#    - Start: npm start
# 4. Add environment variables from backend/.env.production
# 5. Deploy
```

**RAG Service:**

```powershell
# 1. Click "New +" → "Web Service"
# 2. Configure:
#    - Name: health-assistant-rag
#    - Environment: Docker
#    - Dockerfile: ./backend/Dockerfile.rag
# 3. Add environment variables
# 4. Deploy
```

**Predict Service:**

```powershell
# 1. Click "New +" → "Web Service"
# 2. Configure:
#    - Name: health-assistant-predict
#    - Environment: Docker
#    - Dockerfile: ./backend/Dockerfile.predict
# 3. Add environment variables
# 4. Deploy
```

### Local Testing Before Deployment

```powershell
# Test main backend
docker build -t health-assistant-backend:latest -f backend/Dockerfile backend/
docker run -p 5000:5000 -e NODE_ENV=production health-assistant-backend:latest

# Test RAG service
docker build -t health-assistant-rag:latest -f backend/Dockerfile.rag backend/
docker run -p 8001:8001 -e NODE_ENV=production health-assistant-rag:latest

# Test Predict service
docker build -t health-assistant-predict:latest -f backend/Dockerfile.predict backend/
docker run -p 8002:8002 health-assistant-predict:latest
```

---

## 🤖 Model Deployment

### Option 1: Hugging Face Hub (Recommended)

```powershell
# Windows PowerShell
.\deploy-model.ps1 -Method huggingface

# Or Manual:
pip install huggingface-hub
huggingface-cli login
huggingface-cli upload-folder backend --repo-id=your-username/health-assistant-model

# Access at: https://huggingface.co/your-username/health-assistant-model
```

### Option 2: AWS S3

```powershell
# Windows PowerShell
.\deploy-model.ps1 -Method s3

# Or Manual:
aws s3 cp backend/without_handling_dataimbalance_nonlinear3.h5 s3://your-bucket/models/

# Generate signed URL (7 days)
aws s3 presign s3://your-bucket/models/without_handling_dataimbalance_nonlinear3.h5 --expires-in 604800
```

### Option 3: GitHub LFS (Included in Dockerfile)

```powershell
# Windows PowerShell
.\deploy-model.ps1 -Method lfs

# Or Manual:
git lfs install
git lfs track "*.h5"
git add .gitattributes backend/*.h5
git commit -m "Add ML model with Git LFS"
git push origin main
```

---

## 🔐 Environment Variables Setup

### Create MongoDB Atlas Database

```
1. Go to https://www.mongodb.com/cloud/atlas
2. Create cluster
3. Create database user
4. Get connection string: mongodb+srv://user:password@cluster.mongodb.net/dbname
```

### Set Environment Variables

#### Frontend (.env.production)

```bash
# File: .env.production
VITE_API_URL=https://your-backend.render.com/api
VITE_RAG_API_URL=https://your-rag-service.render.com/api/rag
VITE_PREDICT_API_URL=https://your-predict-service.render.com
```

#### Backend (.env.production)

```bash
# File: backend/.env.production
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname
JWT_SECRET_KEY=your_very_secure_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GOOGLE_GENAI_API_KEY=your_google_genai_key
RAG_SERVICE_URL=https://your-rag-service.render.com
PREDICT_SERVICE_URL=https://your-predict-service.render.com
FRONTEND_URL=https://your-frontend.vercel.app
```

#### RAG Service (.env.production)

```bash
# File: backend/rag_service/.env.production
NODE_ENV=production
PORT=8001
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname
GOOGLE_GENAI_API_KEY=your_google_genai_key
JWT_SECRET_KEY=your_jwt_secret_key
ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://your-backend.render.com
```

#### Predict Service (.env.predict.production)

```bash
# File: backend/.env.predict.production
NODE_ENV=production
PORT=8002
MODEL_PATH=/app/without_handling_dataimbalance_nonlinear3.h5
ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://your-backend.render.com
```

---

## ✅ Verify Deployment

### Test Frontend

```bash
curl https://your-frontend.vercel.app
```

### Test Backend

```bash
curl https://your-backend.render.com/api/health
```

### Test RAG Service

```bash
curl https://your-rag-service.render.com/
```

### Test Predict Service

```bash
curl https://your-predict-service.render.com/health
```

---

## 🔄 Update After Deployment

### Simple Push Update (Auto-deploys on all platforms)

```powershell
git add .
git commit -m "Update: your changes"
git push origin main
```

### Backend Services Update on Render

```
1. Make changes locally
2. Push to GitHub
3. Render auto-deploys on git push
4. Check deployment status at https://dashboard.render.com
```

### Frontend Update on Vercel

```
1. Make changes locally
2. Push to GitHub
3. Vercel auto-deploys
4. Check deployment at https://vercel.com/dashboard
```

---

## 📊 Monitor Deployments

### Vercel

- Dashboard: https://vercel.com/dashboard
- Logs: Click project → Deployments → View logs

### Render

- Dashboard: https://dashboard.render.com
- Logs: Click service → Logs tab

### MongoDB

- Dashboard: https://cloud.mongodb.com
- Monitor query performance and storage usage

---

## 🐛 Troubleshooting

### Frontend won't load

```powershell
# Check build
npm run build

# Check environment variables in Vercel dashboard
# Verify VITE_API_URL is correct

# Clear cache
vercel --prod --force
```

### Backend service crashes

```powershell
# View logs on Render dashboard
# Check environment variables
# Verify MongoDB connection string
# Check Docker build logs
```

### Model too large for deployment

```powershell
# Use Git LFS
git lfs install
git lfs track "*.h5"

# Or upload to external storage (Hugging Face, S3)
# Then download during service startup
```

### CORS errors

```javascript
// Update server.js CORS for production:
const corsOrigins = {
  production: [
    "https://your-frontend.vercel.app",
    "https://your-backend.render.com",
  ],
};
```

---

## 💾 Database Backups

### MongoDB Atlas Automated Backups

```
1. Go to MongoDB Atlas dashboard
2. Click Cluster → Backup tab
3. Enable Continuous Backup
4. Backups auto-generated every 6 hours
```

### Manual Backup

```powershell
# Export database
mongodump --uri "mongodb+srv://user:password@cluster.mongodb.net/dbname" --out ./backup

# Import database
mongorestore --uri "mongodb+srv://user:password@cluster.mongodb.net/dbname" ./backup/dbname
```

---

## 💰 Cost Summary

| Service             | Free Tier            | Paid                   |
| ------------------- | -------------------- | ---------------------- |
| **Vercel Frontend** | 20GB bandwidth/month | ~$20/month             |
| **Render Backend**  | 750 hours/month      | $12/month each         |
| **MongoDB Atlas**   | 512MB storage        | $57+/month             |
| **GitHub LFS**      | 1GB free             | $5 per 50GB            |
| **Hugging Face**    | Unlimited            | Free (or paid hosting) |
| **AWS S3**          | 1GB first year       | ~$0.023 per GB         |
| **Total Minimal**   | ~$0 (tight limits)   | ~$36/month             |

---

## 📚 Useful Links

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **MongoDB Docs**: https://docs.mongodb.com
- **Docker Docs**: https://docs.docker.com
- **Hugging Face**: https://huggingface.co

---

## 🎯 Deployment Checklist

- [ ] GitHub repository created and pushed
- [ ] MongoDB Atlas cluster created
- [ ] All environment variables collected
- [ ] `.env.production` files created
- [ ] Docker images tested locally
- [ ] Vercel account created
- [ ] Render account created
- [ ] Cloudinary API keys obtained
- [ ] Google Gemini API key obtained
- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Render
- [ ] RAG service deployed to Render
- [ ] Predict service deployed to Render
- [ ] Model uploaded to Hugging Face/S3/Git LFS
- [ ] URLs updated in environment variables
- [ ] All endpoints tested
- [ ] Monitoring setup complete
- [ ] SSL certificates verified
