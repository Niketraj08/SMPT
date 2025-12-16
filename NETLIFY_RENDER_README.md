# 📦 Netlify & Render Deployment Guide

Complete guide to deploy WARP SMTP frontend to Netlify and backend to Render.

## 🎯 Quick Start

### Option 1: Automated Deployment (Windows)
```powershell
.\deploy-netlify-render.ps1
```

### Option 2: Automated Deployment (Linux/Mac)
```bash
chmod +x deploy-netlify-render.sh
./deploy-netlify-render.sh
```

### Option 3: Manual Deployment
Follow the [QUICK_DEPLOYMENT_CHECKLIST.md](QUICK_DEPLOYMENT_CHECKLIST.md)

---

## 📋 Files Overview

### Deployment Configuration Files

| File | Purpose |
|------|---------|
| `NETLIFY_RENDER_DEPLOYMENT.md` | Complete step-by-step guide |
| `QUICK_DEPLOYMENT_CHECKLIST.md` | Quick checklist for deployment |
| `netlify.toml` | Netlify build configuration |
| `render.yaml` | Render deployment configuration |
| `deploy-netlify-render.sh` | Bash deployment script (Linux/Mac) |
| `deploy-netlify-render.ps1` | PowerShell deployment script (Windows) |
| `.env.example` | Environment variables template |

### Project Structure

```
WARP SMPT/
├── client/                    # React Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── Form.jsx      # ✅ Updated with env variable
│   │   ├── pages/
│   │   │   └── Contact.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── server/                    # Express backend
│   ├── index.js
│   ├── controllers/
│   ├── routes/
│   ├── utils/
│   └── package.json
└── Configuration files...
```

---

## 🚀 Deployment Architecture

```
┌─────────────────────────────────────────────────────┐
│         User's Browser                              │
│  (https://your-site.netlify.app)                   │
└────────────────┬────────────────────────────────────┘
                 │ HTTP/HTTPS
                 ▼
┌─────────────────────────────────────────────────────┐
│         Netlify CDN                                 │
│  - Serves React frontend (dist files)              │
│  - Handles static assets & routing                 │
│  - Free SSL/HTTPS                                   │
└────────────────┬────────────────────────────────────┘
                 │ AJAX Requests
                 │ (VITE_API_URL)
                 ▼
┌─────────────────────────────────────────────────────┐
│         Render Web Service                          │
│  - Express.js API server                           │
│  - CORS enabled                                     │
│  - Nodemailer SMTP integration                     │
│  - Health check endpoint                            │
└─────────────────────────────────────────────────────┘
                 │ SMTP Protocol
                 ▼
┌─────────────────────────────────────────────────────┐
│         Email Provider                              │
│  - Gmail, Outlook, SendGrid, or other              │
│  - Delivers email to recipient                     │
└─────────────────────────────────────────────────────┘
```

---

## 🔧 Key Configuration Details

### Frontend (Netlify)

**Build Settings:**
- Base directory: `client`
- Build command: `npm run build`
- Publish directory: `dist`

**Environment Variables:**
```
VITE_API_URL=https://warp-smtp-backend.onrender.com
```

**Key Updates:**
- ✅ `Form.jsx` uses `import.meta.env.VITE_API_URL`
- ✅ `netlify.toml` configured for auto-deployment
- ✅ Fallback to localhost for development

### Backend (Render)

**Build Settings:**
- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`

**Environment Variables:**
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

**Key Features:**
- ✅ Health check endpoint: `/api/health`
- ✅ CORS configured dynamically
- ✅ Graceful error handling
- ✅ Production-ready logging

---

## 🔑 Getting Email Credentials

### Gmail (Recommended)

1. **Enable 2-Step Verification:**
   - Visit [myaccount.google.com](https://myaccount.google.com)
   - Security → 2-Step Verification → Enable

2. **Generate App Password:**
   - Security → App passwords
   - Select "Mail" and "Windows Computer"
   - Google generates a 16-character password
   - Copy this as `SMTP_PASS`

3. **Configuration:**
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-16-char-password
   ```

### Outlook / Office365

1. **Create App Password:**
   - Go to [account.microsoft.com](https://account.microsoft.com)
   - Security → Advanced security options
   - Create new app password
   - Copy this as `SMTP_PASS`

2. **Configuration:**
   ```
   SMTP_HOST=smtp-mail.outlook.com
   SMTP_PORT=587
   SMTP_USER=your-email@outlook.com
   SMTP_PASS=your-app-password
   ```

### SendGrid (For Scale)

1. **Create API Key:**
   - Go to [sendgrid.com](https://sendgrid.com)
   - Settings → API Keys
   - Create new key with "Mail Send" permission

2. **Configuration:**
   ```
   SENDGRID_API_KEY=your-api-key
   ```

---

## ✅ Deployment Checklist

### Pre-Deployment
- [ ] Code committed to GitHub
- [ ] `.env` file created with email credentials
- [ ] All environment variables filled
- [ ] Frontend builds successfully: `npm run build`
- [ ] Backend starts successfully: `npm start`

### Netlify Deployment
- [ ] GitHub repository connected
- [ ] Build command configured: `npm run build`
- [ ] Publish directory: `dist`
- [ ] `VITE_API_URL` environment variable set
- [ ] Site deployed and accessible

### Render Deployment
- [ ] GitHub repository connected
- [ ] Root directory set to `server`
- [ ] All environment variables configured
- [ ] Service deployed and running
- [ ] Health check passes: `/api/health`

### Post-Deployment
- [ ] Test form submission on Netlify site
- [ ] Verify email is received
- [ ] Check Render logs for errors
- [ ] Check Netlify build logs
- [ ] Test on different browsers

---

## 🧪 Testing

### Test Health Endpoint
```bash
curl https://warp-smtp-backend.onrender.com/api/health
```

Expected response:
```json
{"status":"ok"}
```

### Test Form Submission
1. Visit your Netlify site
2. Fill out the contact form
3. Click "Submit"
4. Check your email inbox for the message

### Check Logs

**Render Logs:**
1. Go to [render.com dashboard](https://dashboard.render.com)
2. Select your service
3. Click "Logs" tab
4. Look for POST requests to `/api/send-mail`

**Netlify Logs:**
1. Go to [netlify.com dashboard](https://app.netlify.com)
2. Select your site
3. Click "Deploys" tab
4. View build logs

---

## 🐛 Troubleshooting

### Form Not Submitting

**Error:** "Network error" or timeout

**Solutions:**
1. Check browser console (F12 → Console tab)
2. Verify `VITE_API_URL` in Netlify environment matches actual backend URL
3. Check CORS settings in backend
4. Ensure backend service is running on Render
5. Check Render logs for errors

### Email Not Sending

**Error:** "SMTP Error" or "Permission denied"

**Solutions:**
1. Verify email credentials in Render environment
2. For Gmail: Confirm App Password (not main password)
3. For Gmail: Enable "Less Secure App Access" if needed
4. Check SMTP_HOST and SMTP_PORT are correct
5. Verify SMTP_USER matches your email
6. Check Render logs for detailed error message

### Deployment Fails

**Error:** Build failed or service won't start

**Solutions:**
1. Check build logs in Netlify/Render
2. Verify `package.json` has all required dependencies
3. Ensure Node version is compatible (18+)
4. Check for environment variable issues
5. Run locally: `npm install && npm start`

### CORS Errors

**Error:** "Access to XMLHttpRequest blocked by CORS policy"

**Solutions:**
1. Verify `CLIENT_ORIGIN` in Render matches Netlify URL
2. Restart the Render service
3. Check server CORS configuration
4. Ensure `CLIENT_ORIGIN` is exact (no trailing slash)

### SSL/HTTPS Issues

**Error:** "Mixed content error" or "Invalid certificate"

**Solutions:**
1. Use HTTPS for backend URL: `https://...onrender.com`
2. Netlify provides free HTTPS
3. Render provides free HTTPS
4. No manual configuration needed

---

## 📊 Performance Tips

### Frontend (Netlify)
- ✅ Vite optimizes production builds
- ✅ CDN caches static files globally
- ✅ Enable gzip compression (automatic)
- ✅ Monitor Core Web Vitals in Netlify Analytics

### Backend (Render)
- ✅ Node.js efficient for I/O operations
- ✅ SMTP is fast (usually <1 second)
- ✅ Use Render's paid tier for more resources
- ✅ Monitor logs for slow requests

---

## 🔒 Security Best Practices

### Environment Variables
- ✅ Never commit `.env` to Git
- ✅ Use `.env.example` as template
- ✅ Rotate credentials regularly
- ✅ Use unique passwords per service

### Email Security
- ✅ Use App Passwords (not main password)
- ✅ Enable 2FA on email accounts
- ✅ Monitor for unauthorized access
- ✅ Implement rate limiting if needed

### API Security
- ✅ CORS restricts requests by origin
- ✅ No sensitive data in API responses
- ✅ Validate all form inputs
- ✅ Monitor logs for suspicious activity

### SSL/HTTPS
- ✅ All communication encrypted
- ✅ Netlify provides free SSL
- ✅ Render provides free SSL
- ✅ Automatic renewal

---

## 📈 Scaling & Upgrades

### When to Upgrade Netlify
- Site grows beyond free tier limits
- Need more build minutes (300 min/month free)
- Want custom domain with paid plan
- Need advanced features (forms, analytics)

### When to Upgrade Render
- High traffic volume
- Free tier sleeping issues
- Need dedicated resources
- Database backend needed

---

## 🆘 Support

### Documentation
- [Netlify Docs](https://docs.netlify.com)
- [Render Docs](https://render.com/docs)
- [Express.js Docs](https://expressjs.com)
- [Vite Docs](https://vitejs.dev)

### Helpful Links
- [Gmail App Password Guide](https://support.google.com/accounts/answer/185833)
- [Outlook App Password Guide](https://support.microsoft.com/en-us/account-billing/sign-in-with-app-passwords-vs-two-step-verification)
- [Netlify Deployment Issues](https://docs.netlify.com/configure-builds/get-started/)
- [Render Logs & Debugging](https://render.com/docs/troubleshooting)

---

## 📝 Deployment Summary

**Deployment Date:** December 16, 2025  
**Status:** ✅ Ready for Production

| Component | Platform | Configuration | Status |
|-----------|----------|---|--------|
| Frontend | Netlify | `netlify.toml` | ✅ Ready |
| Backend | Render | `render.yaml` | ✅ Ready |
| Email | Gmail/Outlook/SendGrid | `.env` | ✅ Ready |
| API Integration | Full | `VITE_API_URL` | ✅ Ready |

---

**Next Steps:**
1. Push to GitHub
2. Run deployment script or follow checklist
3. Configure Render and Netlify
4. Test form submission
5. Monitor logs for issues

Good luck! 🚀
