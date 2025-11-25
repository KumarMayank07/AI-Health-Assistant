# 📋 Pre-Deployment Checklist

Use this checklist to ensure everything is ready before deployment.

## 🔐 Accounts & Services

- [ ] **GitHub Account**

  - [ ] Repository created and code pushed
  - [ ] Repository is public or private (as needed)
  - [ ] Main branch protected (optional)

- [ ] **Vercel Account**

  - [ ] Account created at https://vercel.com
  - [ ] GitHub account linked
  - [ ] Project created or ready to create

- [ ] **Render Account**

  - [ ] Account created at https://render.com
  - [ ] GitHub account linked

- [ ] **MongoDB Atlas**

  - [ ] Cluster created (M0 free tier OK for development)
  - [ ] Database user created
  - [ ] IP whitelist configured (0.0.0.0/0 for now)
  - [ ] Connection string saved

- [ ] **Cloudinary Account**

  - [ ] Account created at https://cloudinary.com
  - [ ] API key and secret saved

- [ ] **Google Cloud / Gemini API**
  - [ ] Account created at https://cloud.google.com
  - [ ] Gemini API enabled
  - [ ] API key generated and saved

---

## 📁 Repository Structure

- [ ] Frontend files ready:

  - [ ] `src/` folder complete
  - [ ] `package.json` has correct dependencies
  - [ ] `vite.config.ts` configured
  - [ ] Environment file templates created

- [ ] Backend files ready:

  - [ ] `server.js` configured for production
  - [ ] `package.json` updated
  - [ ] All routes working
  - [ ] Database models complete
  - [ ] Middleware configured

- [ ] RAG Service ready:

  - [ ] `main.py` configured
  - [ ] `requirements.txt` updated
  - [ ] CORS settings configured
  - [ ] Gemini API integration working

- [ ] ML Model ready:

  - [ ] Model file `without_handling_dataimbalance_nonlinear3.h5` present
  - [ ] `predict_service.py` complete
  - [ ] `predict_requirements.txt` updated

- [ ] Docker files present:

  - [ ] `backend/Dockerfile` created
  - [ ] `backend/Dockerfile.rag` created
  - [ ] `backend/Dockerfile.predict` created

- [ ] Configuration files created:

  - [ ] `.env.production` (frontend)
  - [ ] `backend/.env.production`
  - [ ] `backend/rag_service/.env.production`
  - [ ] `backend/.env.predict.production`
  - [ ] `vercel.json`
  - [ ] `render.yaml`
  - [ ] `Procfile`

- [ ] Deployment scripts created:

  - [ ] `deploy-frontend.ps1`
  - [ ] `deploy-backend.ps1`
  - [ ] `deploy-model.ps1`
  - [ ] `deploy-all.ps1`

- [ ] Documentation:
  - [ ] `DEPLOYMENT_GUIDE.md` created
  - [ ] `DEPLOYMENT_COMMANDS.md` created
  - [ ] `README.md` updated with deployment instructions

---

## 🔧 Code Quality

- [ ] **Frontend**

  - [ ] No console errors in browser
  - [ ] No TypeScript errors: `npm run lint`
  - [ ] Build completes: `npm run build`
  - [ ] All pages load
  - [ ] API calls use environment variables

- [ ] **Backend**

  - [ ] No security vulnerabilities
  - [ ] All routes tested locally
  - [ ] Environment variables read correctly
  - [ ] Database connections working
  - [ ] Error handling implemented
  - [ ] CORS configured for production

- [ ] **Services**
  - [ ] RAG service starts without errors
  - [ ] Predict service starts without errors
  - [ ] Models load correctly
  - [ ] API responses format correct

---

## 🌍 Environment Variables

### Frontend

- [ ] `VITE_API_URL` - Backend API URL
- [ ] `VITE_RAG_API_URL` - RAG service URL
- [ ] `VITE_PREDICT_API_URL` - Predict service URL

### Backend

- [ ] `NODE_ENV` = `production`
- [ ] `PORT` configured
- [ ] `MONGODB_URI` - Full MongoDB connection string
- [ ] `JWT_SECRET_KEY` - Strong random string
- [ ] `CLOUDINARY_CLOUD_NAME`
- [ ] `CLOUDINARY_API_KEY`
- [ ] `CLOUDINARY_API_SECRET`
- [ ] `GOOGLE_GENAI_API_KEY`
- [ ] `RAG_SERVICE_URL` - Full URL to RAG service
- [ ] `PREDICT_SERVICE_URL` - Full URL to predict service
- [ ] `FRONTEND_URL` - Full URL to frontend

### RAG Service

- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `8001`
- [ ] `MONGODB_URI` - Same as backend
- [ ] `GOOGLE_GENAI_API_KEY` - Same as backend
- [ ] `JWT_SECRET_KEY` - Same as backend
- [ ] `ALLOWED_ORIGINS` - Frontend and backend URLs

### Predict Service

- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `8002`
- [ ] `MODEL_PATH` = `/app/without_handling_dataimbalance_nonlinear3.h5`
- [ ] `ALLOWED_ORIGINS` - Frontend and backend URLs

---

## 🐳 Docker Verification

- [ ] Docker installed locally
- [ ] Dockerfile builds without errors:
  ```powershell
  docker build -t health-assistant-backend:latest -f backend/Dockerfile backend/
  ```
- [ ] Docker images start without errors:
  ```powershell
  docker run -p 5000:5000 health-assistant-backend:latest
  ```
- [ ] Services respond to health checks
- [ ] Model loads in container

---

## 📦 Vercel Deployment Prep

- [ ] Account created at https://vercel.com
- [ ] GitHub repository connected
- [ ] Environment variables ready:
  - [ ] `VITE_API_URL`
  - [ ] `VITE_RAG_API_URL`
  - [ ] `VITE_PREDICT_API_URL`
- [ ] Build settings:
  - [ ] Build Command: `npm run build`
  - [ ] Output Directory: `dist`
  - [ ] Install Command: `npm ci`
- [ ] Vercel domain noted or custom domain configured

---

## 🟦 Render Deployment Prep

- [ ] Account created at https://render.com
- [ ] GitHub repository connected
- [ ] Three services ready:

  1. **Main Backend Service**

     - [ ] Runtime: Node
     - [ ] Build: `npm install`
     - [ ] Start: `npm start`
     - [ ] Environment variables loaded

  2. **RAG Service**

     - [ ] Runtime: Docker
     - [ ] Dockerfile: `backend/Dockerfile.rag`
     - [ ] Environment variables loaded

  3. **Predict Service**
     - [ ] Runtime: Docker
     - [ ] Dockerfile: `backend/Dockerfile.predict`
     - [ ] Model file included
     - [ ] Environment variables loaded

- [ ] Render URLs noted for frontend updates
- [ ] Databases linked or created

---

## 🤖 Model Deployment Prep

Choose one approach:

### Hugging Face Hub

- [ ] Account created at https://huggingface.co
- [ ] Hugging Face token generated
- [ ] `huggingface-hub` package available
- [ ] Model repository created
- [ ] Ready to upload via: `.\deploy-model.ps1 -Method huggingface`

### AWS S3

- [ ] AWS account created
- [ ] S3 bucket created
- [ ] AWS CLI configured
- [ ] IAM credentials ready
- [ ] Ready to upload via: `.\deploy-model.ps1 -Method s3`

### Git LFS (Recommended for Docker)

- [ ] Git LFS installed locally
- [ ] `.gitattributes` ready
- [ ] Model tracked with LFS
- [ ] Ready to push: `.\deploy-model.ps1 -Method lfs`

---

## 📊 Testing

### Frontend Testing

- [ ] Page loads without errors
- [ ] Login page displays
- [ ] Can navigate between pages
- [ ] API calls working (check Network tab)
- [ ] Error handling visible
- [ ] Mobile responsive

### Backend Testing

- [ ] Health check endpoint responds:
  ```bash
  curl https://your-backend-url/api/health
  ```
- [ ] Authentication endpoints working
- [ ] Database queries successful
- [ ] File uploads working
- [ ] Error messages helpful

### Integration Testing

- [ ] Frontend connects to backend
- [ ] Backend connects to MongoDB
- [ ] RAG service responds to chat requests
- [ ] ML model makes predictions
- [ ] All data flows correctly

---

## 🔐 Security Checks

- [ ] No secrets in code (check `.gitignore`)
- [ ] No API keys committed
- [ ] No passwords in code
- [ ] Environment variables not logged
- [ ] HTTPS enforced (Vercel/Render handle this)
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation implemented
- [ ] SQL injection protection (if using SQL)
- [ ] XSS protection enabled

---

## 📚 Documentation Ready

- [ ] `DEPLOYMENT_GUIDE.md` complete
- [ ] `DEPLOYMENT_COMMANDS.md` accessible
- [ ] README updated with:
  - [ ] Deployment instructions
  - [ ] Environment variable descriptions
  - [ ] How to run locally
  - [ ] Troubleshooting section
- [ ] Comments in critical code sections

---

## ✅ Final Verification

- [ ] All team members informed
- [ ] Backup of production data exists
- [ ] Monitoring setup (logs, errors)
- [ ] Support contact information shared
- [ ] Rollback plan documented
- [ ] All URLs noted in safe place
- [ ] First user identified for testing

---

## 🚀 Deployment Day

1. [ ] Final code review completed
2. [ ] All tests pass
3. [ ] Environment variables triple-checked
4. [ ] Team notified of deployment
5. [ ] Deployment starts during low-traffic hours
6. [ ] Monitor for errors in real-time
7. [ ] Verify all services running
8. [ ] Run post-deployment tests
9. [ ] Announce successful deployment
10. [ ] Document any issues encountered

---

## 📞 After Deployment

- [ ] Monitor error logs daily
- [ ] Check database performance
- [ ] Verify backups working
- [ ] Update team wiki/docs
- [ ] Schedule post-deployment retrospective
- [ ] Plan next improvements

---

## 🆘 Emergency Contacts

| Role     | Contact | Availability |
| -------- | ------- | ------------ |
| Dev Lead |         |              |
| DevOps   |         |              |
| DBA      |         |              |
| On-Call  |         |              |

---

## 📝 Notes

Use this space for deployment-specific notes:

```
[Add your notes here]
```

---

**Last Updated**: [Date]
**Deployment Status**: Not Yet Deployed
**Deployed To**: [URL once deployed]
