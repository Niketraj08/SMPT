# 🚀 Netlify & Render Deployment Guide
**WARP SMTP - Contact Form**  
**Complete Step-by-Step Setup**

---

## 📋 Table of Contents
1. [Frontend Deployment (Netlify)](#frontend-netlify)
2. [Backend Deployment (Render)](#backend-render)
3. [Environment Variables Setup](#environment-variables)
4. [Post-Deployment Testing](#testing)
5. [Troubleshooting](#troubleshooting)

---

## 🎨 Frontend Deployment (Netlify)

### Prerequisites
- GitHub account (with project repository)
- Netlify account (free at netlify.com)
- Repository already pushed to GitHub

### Step 1: Prepare Frontend for Deployment

The frontend is already Vite-configured. Ensure your build files are optimized:

```bash
cd client
npm run build
```

This creates a `dist/` folder that Netlify will deploy.

### Step 2: Create GitHub Repository

If not already done:
```bash
git init
git add .
git commit -m "Initial commit - WARP SMTP Contact Form"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/WARP-SMTP.git
git push -u origin main
```

### Step 3: Connect to Netlify

1. Go to [netlify.com](https://netlify.com)
2. Click **"Connect Git Repository"**
3. Choose GitHub and authorize
4. Select your `WARP-SMTP` repository
5. Configure build settings:
   - **Base directory:** `client`
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`

### Step 4: Set Environment Variables in Netlify

1. In Netlify dashboard → **Site Settings → Environment**
2. Add the following variable:
   ```
   VITE_API_URL = https://your-render-backend-url.onrender.com
   ```
   *(You'll get the Render URL after deploying backend)*

3. Click **Deploy**

### Step 5: Configure Custom Domain (Optional)

1. In Netlify → **Domain settings**
2. Add your custom domain
3. Update DNS records if needed

---

## ⚙️ Backend Deployment (Render)

### Prerequisites
- GitHub account (with project repository)
- Render account (free at render.com)
- Node.js server code ready

### Step 1: Prepare Backend for Deployment

Ensure `server/package.json` has:
```json
{
  "scripts": {
    "start": "node index.js"
  }
}
```

And your `.env` file has all required variables (see Environment Variables section).

### Step 2: Create GitHub Repository (if not done)

```bash
git add .
git commit -m "Add server configuration"
git push origin main
```

### Step 3: Deploy to Render

1. Go to [render.com](https://render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub repository
4. Fill in deployment settings:
   - **Name:** `warp-smtp-backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free (or Paid for production)

### Step 4: Configure Environment Variables in Render

1. In Render dashboard → **Environment**
2. Add all variables from `.env`:

```
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SENDER_EMAIL=your-email@gmail.com
SENDER_NAME=WARP Contact Form

# Frontend Origin
CLIENT_ORIGIN=https://your-netlify-site.netlify.app

# Server Port
PORT=3000

# Security
NODE_ENV=production
```

3. Click **"Deploy"**

---

## 🔐 Environment Variables Setup

### Backend (.env file in root directory)

```env
# ========== EMAIL SERVICE ==========
# Gmail Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SENDER_EMAIL=your-email@gmail.com
SENDER_NAME=WARP SMTP

# OR Outlook/Office365
# SMTP_HOST=smtp-mail.outlook.com
# SMTP_PORT=587
# SMTP_USER=your-email@outlook.com
# SMTP_PASS=your-password

# OR SendGrid
# SENDGRID_API_KEY=your-sendgrid-api-key

# ========== CLIENT CONFIGURATION ==========
CLIENT_ORIGIN=https://your-netlify-site.netlify.app
PORT=3000

# ========== SERVER CONFIGURATION ==========
NODE_ENV=production
```

### Frontend Environment (Netlify build vars)

```
VITE_API_URL=https://warp-smtp-backend.onrender.com
```

---

## ✅ Post-Deployment Testing

### 1. Test Backend Health Check

```bash
curl https://your-render-backend-url.onrender.com/api/health
```

Expected response:
```json
{"status":"ok"}
```

### 2. Test Frontend

1. Visit `https://your-netlify-site.netlify.app`
2. Fill out the contact form
3. Submit and check if email is received

### 3. Check Backend Logs

In Render dashboard:
1. Select your web service
2. Click **"Logs"** tab
3. Verify requests are being received

---

## 🔗 API Integration Checklist

- [ ] Backend deployed on Render
- [ ] Get backend URL: `https://warp-smtp-backend.onrender.com`
- [ ] Set `VITE_API_URL` in Netlify environment
- [ ] Set `CLIENT_ORIGIN` in Render environment
- [ ] Frontend built and deployed
- [ ] Test health endpoint
- [ ] Test form submission
- [ ] Verify emails are sent

---

## 🚨 Troubleshooting

### Frontend Issues

**Form not submitting:**
1. Check browser console for errors
2. Verify `VITE_API_URL` is correct in Netlify
3. Check CORS settings in backend

**Blank page:**
1. Check build logs in Netlify
2. Verify build command: `npm run build`
3. Check published directory: `dist`

### Backend Issues

**Service won't start:**
1. Check "Logs" in Render dashboard
2. Verify all env variables are set
3. Ensure `PORT` environment variable exists

**Timeout errors:**
1. Increase Render timeout in settings
2. Check email service credentials
3. Verify SMTP host and port

**CORS errors:**
1. Update `CLIENT_ORIGIN` with correct frontend URL
2. Restart backend service in Render

### Email Not Sending

**Gmail:**
1. Enable "Less secure app access" or use App Password
2. Verify credentials in Render environment
3. Check SMTP_PORT is 587 (TLS) or 465 (SSL)

**Outlook:**
1. Verify email format
2. Check SMTP_HOST is correct
3. Ensure MFA is handled with App Password

---

## 📊 Deployment Summary

| Component | Platform | Status | URL |
|-----------|----------|--------|-----|
| Frontend | Netlify | ✅ | https://your-site.netlify.app |
| Backend | Render | ✅ | https://warp-smtp-backend.onrender.com |
| Database | - | N/A | (Contact form doesn't use DB) |
| Email | Gmail/Outlook/SendGrid | ✅ | Configured |

---

## 🎯 Next Steps

1. **Monitor**: Check Render and Netlify logs regularly
2. **Backup**: Keep `.env` file safe (don't commit)
3. **Update**: Keep dependencies updated
4. **Scale**: Upgrade Render plan if needed for production

---

**Deployment Date:** December 16, 2025  
**Status:** ✅ Ready for Production
