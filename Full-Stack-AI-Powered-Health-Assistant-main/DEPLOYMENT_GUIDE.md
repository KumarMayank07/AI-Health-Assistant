# Full Stack AI Health Assistant - Deployment Guide

## 🚀 Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                      Frontend (Vercel)                              │
│                  React + Vite + TypeScript                          │
│              https://your-frontend-domain.com                       │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
        ┌───────────▼──────────┐  ┌──▼─────────────────┐
        │  Backend (Render)    │  │ RAG Service        │
        │  Node.js + Express   │  │ (Docker/Render)    │
        │  MongoDB + Auth      │  │ FastAPI + Gemini   │
        └───────────┬──────────┘  └──┬─────────────────┘
                    │                 │
        ┌───────────▼─────────────────▼──────────┐
        │  Predict Service (Render/Railway)       │
        │  Python + TensorFlow + FastAPI          │
        │  Model: without_handling_..._nonlinear3 │
        └─────────────────────────────────────────┘
```

## 📋 Prerequisites

- Vercel account (https://vercel.com)
- Render account (https://render.com)
- MongoDB Atlas account (https://www.mongodb.com/cloud/atlas)
- Git repository pushed to GitHub
- Docker installed (for local testing)
- Node.js 18+ installed
- Python 3.11+ installed

## 🔧 Environment Variables Setup

### Frontend (.env.production)

```
VITE_API_URL=https://your-backend.render.com/api
VITE_RAG_API_URL=https://your-rag-service.render.com/api/rag
VITE_PREDICT_API_URL=https://your-predict-service.render.com
```

### Backend (.env.production)

```
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
NODE_ENV=production
```

### RAG Service (.env.production)

```
NODE_ENV=production
PORT=8001
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname
GOOGLE_GENAI_API_KEY=your_google_genai_key
JWT_SECRET_KEY=your_very_secure_secret_key_here
ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://your-backend.render.com
```

### Predict Service (.env.predict.production)

```
NODE_ENV=production
PORT=8002
MODEL_PATH=/app/without_handling_dataimbalance_nonlinear3.h5
ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://your-backend.render.com
```

## 📦 Step 1: Setup MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a new project
3. Create a cluster (free tier available)
4. Create a database user with strong password
5. Get connection string: `mongodb+srv://user:password@cluster.mongodb.net/dbname`
6. Add IP whitelist (0.0.0.0/0 for development, specific IPs for production)

## 🌐 Step 2: Deploy Frontend to Vercel

### Option A: Using Vercel CLI

```powershell
# Install Vercel CLI
npm install -g vercel

# Navigate to project root
cd Full-Stack-AI-Powered-Health-Assistant-main

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Option B: Using GitHub Integration

1. Push your code to GitHub
2. Go to https://vercel.com/new
3. Import your GitHub repository
4. Configure project:
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add environment variables:
   - `VITE_API_URL`
   - `VITE_RAG_API_URL`
   - `VITE_PREDICT_API_URL`
6. Click "Deploy"

### Option C: Using Vercel Dashboard

1. Go to https://vercel.com
2. Click "New Project"
3. Import Git repository
4. Configure settings (as above)
5. Deploy

## 🔌 Step 3: Deploy Backend to Render

### Create Render Services

#### 3.1 Main Backend Service

1. Go to https://dashboard.render.com
2. Click "New +"
3. Select "Web Service"
4. Connect GitHub repository
5. Configure:
   - Name: `health-assistant-backend`
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: Standard ($12/month minimum)
6. Add Environment Variables:
   - Copy all from `.env.production`
7. Click "Create Web Service"

#### 3.2 RAG Service

1. Click "New +"
2. Select "Web Service"
3. Configure:
   - Name: `health-assistant-rag`
   - Environment: Docker
   - Build Command: Leave empty (Render auto-detects Dockerfile)
   - Start Command: Leave empty
   - Dockerfile Path: `backend/Dockerfile.rag`
4. Add Environment Variables from `backend/rag_service/.env.production`
5. Deploy

#### 3.3 Predict Service

1. Click "New +"
2. Select "Web Service"
3. Configure:
   - Name: `health-assistant-predict`
   - Environment: Docker
   - Dockerfile Path: `backend/Dockerfile.predict`
4. Add Environment Variables from `backend/.env.predict.production`
5. Deploy

### Using Render CLI Alternative

```powershell
# Install Render CLI
npm install -g @render-oss/render-cli

# Login
render login

# Deploy from render.yaml configuration
```

## 🤖 Step 4: Deploy ML Model

### Option A: Host Model on Hugging Face Hub

```powershell
# 1. Create Hugging Face account: https://huggingface.co

# 2. Install huggingface-hub
pip install huggingface-hub

# 3. Login
huggingface-cli login

# 4. Create a model repository on Hugging Face
# Go to https://huggingface.co/new

# 5. Upload model
python -c "
from huggingface_hub import upload_folder
upload_folder(
    folder_path='./backend',
    repo_id='your-username/health-assistant-model',
    repo_type='model'
)
"
```

### Option B: Host Model on AWS S3

```powershell
# 1. Create AWS S3 bucket
# 2. Upload model file
aws s3 cp backend/without_handling_dataimbalance_nonlinear3.h5 s3://your-bucket/models/

# 3. Generate signed URL for access
aws s3 presign s3://your-bucket/models/without_handling_dataimbalance_nonlinear3.h5
```

### Option C: Include Model in Docker Image (Recommended for Render)

The Dockerfile already includes the model file. Ensure the model is:

- Committed to git (with Git LFS if large)
- Or downloaded during Docker build

Update `Dockerfile.predict`:

```dockerfile
# Download model during build (if not in repo)
RUN curl -L https://your-model-url/model.h5 -o /app/without_handling_dataimbalance_nonlinear3.h5
```

## 🔐 Security Configuration

### Update CORS in Backend (server.js)

```javascript
const corsOrigins = {
  development: [
    "http://localhost:5000",
    "http://localhost:5173",
    "http://localhost:8080",
  ],
  production: [
    "https://your-frontend.vercel.app",
    "https://your-backend.render.com",
    "https://your-rag-service.render.com",
  ],
};

app.use(
  cors({
    origin: corsOrigins[process.env.NODE_ENV] || corsOrigins.development,
    credentials: true,
  })
);
```

### Update RAG Service CORS (main.py)

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-frontend.vercel.app",
        "https://your-backend.render.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 📝 Deployment Commands Summary

### Frontend Deployment (Vercel)

```powershell
# Via CLI
npm install -g vercel
vercel --prod

# Via Git Push (if connected to GitHub)
git push origin main  # Auto-deploys on Vercel
```

### Backend Deployment (Render)

```powershell
# Via Git Push (if connected)
git push origin main

# Manual via CLI
render-cli deploy --service-id=<service-id>
```

### Model Deployment

#### Hugging Face

```powershell
pip install huggingface-hub
huggingface-cli login
huggingface-cli upload-folder ./backend --repo-id=your-username/model-name
```

#### AWS S3

```powershell
aws s3 cp backend/without_handling_dataimbalance_nonlinear3.h5 s3://bucket-name/
```

#### GitHub LFS (for large files)

```powershell
git lfs install
git lfs track "*.h5"
git add .gitattributes backend/*.h5
git commit -m "Add model with LFS"
git push origin main
```

## ✅ Post-Deployment Checklist

- [ ] Frontend loads without errors
- [ ] Frontend can reach backend API (check network tab)
- [ ] Backend authentication works
- [ ] Database connection successful
- [ ] Image uploads work via Cloudinary
- [ ] RAG service responds to chat requests
- [ ] ML model predictions work
- [ ] SSL certificates valid
- [ ] Rate limiting active
- [ ] Error logging configured
- [ ] Monitor services for errors

## 🐛 Troubleshooting

### Frontend won't build on Vercel

- Check Node version matches (18+)
- Verify all environment variables set
- Check build logs in Vercel dashboard

### Backend service crashes on Render

- Check logs: `render logs --service-id=<id>`
- Verify MongoDB connection string
- Check environment variables set correctly

### ML model too large

- Use Git LFS: `git lfs track "*.h5"`
- Or use Hugging Face Hub or S3

### CORS errors

- Update CORS origins in server.js and main.py
- Ensure credentials: true is set

## 📊 Monitoring & Logs

### Vercel

- Dashboard: https://vercel.com/dashboard
- Real-time logs visible in dashboard

### Render

- Dashboard: https://dashboard.render.com
- View logs: Click service → "Logs"

### MongoDB

- MongoDB Atlas: https://cloud.mongodb.com
- Monitor query performance and storage

## 🔄 Continuous Deployment

All services are configured for CD via GitHub:

1. Push to main branch
2. Vercel auto-deploys frontend
3. Render auto-deploys backend services
4. Tests run before deployment (add GitHub Actions)

## 📱 Testing Production URLs

```powershell
# Test frontend
curl https://your-frontend.vercel.app

# Test backend
curl https://your-backend.render.com/api/health

# Test RAG service
curl https://your-rag-service.render.com/

# Test predict service
curl https://your-predict-service.render.com/health
```

## 💰 Cost Estimation

- **Vercel Frontend**: Free tier (20GB bandwidth/month)
- **Render Backend**: $12/month (standard web service)
- **Render RAG**: $12/month (Docker container)
- **Render Predict**: $12/month (Docker container)
- **MongoDB Atlas**: Free tier (512MB, or $57+/month)
- **Total**: ~$36/month + storage/bandwidth

---

For detailed documentation, refer to:

- Vercel: https://vercel.com/docs
- Render: https://render.com/docs
- MongoDB: https://docs.mongodb.com
