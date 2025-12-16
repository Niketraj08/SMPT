# 🎯 Quick Deployment Checklist - Netlify & Render

## ✅ Pre-Deployment Tasks

### 1. GitHub Setup
- [ ] Initialize git repository
- [ ] Create GitHub account
- [ ] Push project to GitHub
  ```bash
  git init
  git add .
  git commit -m "WARP SMTP - Initial commit"
  git branch -M main
  git remote add origin https://github.com/YOUR_USERNAME/WARP-SMTP.git
  git push -u origin main
  ```

### 2. Email Service Setup

**Gmail:**
- [ ] Enable "Less Secure App Access" OR generate App Password
  - Go to myaccount.google.com → Security
  - Enable 2FA if not already enabled
  - Create App Password
- [ ] Note: `SMTP_USER` and `SMTP_PASS`

**Outlook:**
- [ ] Enable "Allow less secure apps" in account settings
- [ ] Or use Office 365 with App Password
- [ ] Note: `SMTP_USER` and `SMTP_PASS`

### 3. Prepare Environment Variables
Create `.env` file in project root:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SENDER_EMAIL=your-email@gmail.com
SENDER_NAME=WARP Contact Form
CLIENT_ORIGIN=https://your-netlify-site.netlify.app
PORT=3000
NODE_ENV=production
```

---

## 🚀 Deployment Steps

### STEP 1: Deploy Backend to Render

1. [ ] Go to [render.com](https://render.com)
2. [ ] Sign up/Login with GitHub
3. [ ] Click "New +" → "Web Service"
4. [ ] Connect to your GitHub repository
5. [ ] Fill in:
   - **Name:** `warp-smtp-backend`
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
6. [ ] Choose plan (Free tier is fine)
7. [ ] Add Environment Variables:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   SENDER_EMAIL=your-email@gmail.com
   SENDER_NAME=WARP Contact Form
   CLIENT_ORIGIN=https://your-netlify-site.netlify.app
   PORT=3000
   NODE_ENV=production
   ```
8. [ ] Click "Deploy"
9. [ ] Wait for deployment to complete
10. [ ] **Copy the backend URL** (e.g., `https://warp-smtp-backend.onrender.com`)

### STEP 2: Deploy Frontend to Netlify

1. [ ] Go to [netlify.com](https://netlify.com)
2. [ ] Sign up/Login with GitHub
3. [ ] Click "Connect Git Repository"
4. [ ] Select your `WARP-SMTP` repository
5. [ ] Configure Build Settings:
   - **Base directory:** `client`
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
6. [ ] Add Environment Variable:
   ```
   VITE_API_URL=https://warp-smtp-backend.onrender.com
   ```
   (Use the backend URL from Step 1)
7. [ ] Click "Deploy Site"
8. [ ] Wait for build and deployment
9. [ ] **Copy the Netlify URL** (e.g., `https://your-site.netlify.app`)

### STEP 3: Update Render Backend

1. [ ] Go back to Render dashboard
2. [ ] Open your `warp-smtp-backend` service
3. [ ] Go to "Environment" tab
4. [ ] Update `CLIENT_ORIGIN` variable:
   ```
   CLIENT_ORIGIN=https://your-site.netlify.app
   ```
5. [ ] Click "Save"
6. [ ] Service will redeploy automatically

---

## ✅ Verification & Testing

### Test Backend Health
```bash
curl https://warp-smtp-backend.onrender.com/api/health
```

**Expected response:**
```json
{"status":"ok"}
```

### Test Frontend
1. [ ] Visit `https://your-netlify-site.netlify.app`
2. [ ] You should see the contact form
3. [ ] Fill out the form with test data
4. [ ] Click "Submit"
5. [ ] Check if you receive an email

### Check Logs
- **Render Logs:** Dashboard → Select service → Logs tab
- **Netlify Logs:** Dashboard → Select site → Deploys tab

---

## 🔧 Troubleshooting Quick Links

### If form submission fails:
1. Open browser DevTools (F12)
2. Go to Network/Console tab
3. Submit form and look for errors
4. Check [Troubleshooting Guide](NETLIFY_RENDER_DEPLOYMENT.md#-troubleshooting)

### If email doesn't send:
1. Verify email credentials in Render environment
2. Check backend logs for SMTP errors
3. Confirm SMTP host and port are correct
4. For Gmail: Verify App Password is used

### If deployment fails:
1. Check build logs in Netlify/Render
2. Verify package.json scripts exist
3. Ensure all dependencies are listed
4. Check for missing environment variables

---

## 📋 Useful Links

- [Render Dashboard](https://dashboard.render.com)
- [Netlify Dashboard](https://app.netlify.com)
- [Full Deployment Guide](NETLIFY_RENDER_DEPLOYMENT.md)
- [Environment Variables Guide](.env.example)

---

## ⏱️ Timeline

| Task | Estimated Time | Status |
|------|-----------------|--------|
| Email service setup | 10 min | ⏳ |
| Backend deployment | 15 min | ⏳ |
| Frontend deployment | 10 min | ⏳ |
| Configuration | 5 min | ⏳ |
| Testing | 5 min | ⏳ |
| **TOTAL** | **~45 min** | ⏳ |

---

**Last Updated:** December 16, 2025  
**Status:** Ready for deployment
