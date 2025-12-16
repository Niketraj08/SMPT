# WARP SMTP - Deployment Files Reference

Complete guide to all deployment-related files in the project.

## 📑 Deployment Files

### 1. **deploy.js** (Automated Deployment Script)
**Purpose:** Automate the entire build and packaging process  
**Usage:** `node deploy.js`  
**Output:** `deploy-package.zip` (ready to upload to server)  
**What it does:**
- Builds React frontend with Vite
- Installs server dependencies
- Packages everything into a zip file
- Creates deployment instructions

**Location:** Root directory

---

### 2. **Dockerfile** (Container Image)
**Purpose:** Define how to build a Docker image  
**Usage:** `docker build -t warp-smtp:latest .`  
**Used by:** Docker and CI/CD pipelines  
**Features:**
- Multi-stage build (optimizes image size)
- Production-ready Node.js image
- Health checks included
- Non-root user for security

**Location:** Root directory

---

### 3. **docker-compose.yml** (Container Orchestration)
**Purpose:** Run the application with a single command  
**Usage:** `docker-compose up -d`  
**What it does:**
- Builds the Docker image
- Runs the container with proper configuration
- Maps ports and volumes
- Sets environment variables
- Includes health checks

**Location:** Root directory  
**Edit before deploying:** Update environment variables section

---

### 4. **.dockerignore** (Docker Exclusions)
**Purpose:** Exclude unnecessary files from Docker image  
**Excludes:** node_modules, logs, .git, .env, etc.  
**Result:** Smaller, faster images

**Location:** Root directory

---

### 5. **nginx.conf** (Reverse Proxy Configuration)
**Purpose:** Configure Nginx for production deployment  
**Usage:** 
```bash
sudo cp nginx.conf /etc/nginx/sites-available/warp-smtp
sudo ln -s /etc/nginx/sites-available/warp-smtp /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

**Features:**
- Reverse proxy to Node.js backend
- Static file serving for React frontend
- GZIP compression
- Security headers
- Caching directives
- SSL/HTTPS ready

**Location:** Root directory  
**Edit before using:** Update `server_name` to your domain

---

### 6. **pm2.config.js** (Process Manager Configuration)
**Purpose:** Keep your Node.js application running with auto-restart  
**Usage:**
```bash
npm install -g pm2
pm2 start pm2.config.js
pm2 save
pm2 startup
```

**Features:**
- Cluster mode for multiple processes
- Auto-restart on failure
- Memory limits
- Logging configuration
- Log merging

**Location:** Root directory  
**Edit before using:** Update user and deployment paths if needed

---

### 7. **.env.example** (Environment Template)
**Purpose:** Show required environment variables without exposing secrets  
**Usage:** `copy .env.example .env`  
**Contains template for:**
- Server configuration (PORT, NODE_ENV)
- Email configuration (RECEIVER_EMAIL, SENDER_EMAIL)
- SMTP credentials (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD)
- CORS configuration (CLIENT_ORIGIN)

**Location:** Root directory  
**Security:** Safe to commit to version control  
**⚠️ Important:** `.env` should NEVER be committed

---

### 8. **.env** (Production Configuration)
**Purpose:** Store actual production secrets and configuration  
**Content:** 
```
PORT=5000
NODE_ENV=production
CLIENT_ORIGIN=https://your-domain.com
RECEIVER_EMAIL=your-email@company.com
SENDER_EMAIL="Company Name <noreply@domain.com>"
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

**Location:** Root directory  
**⚠️ CRITICAL:** 
- Never commit to version control
- Add to .gitignore (already done)
- Keep secure backup
- Update for each deployment

---

## 📚 Documentation Files

### 9. **README.md** (Main Documentation)
**Purpose:** Comprehensive project documentation  
**Contains:**
- Project overview and features
- Installation instructions
- Development setup
- Deployment options overview
- SMTP provider setup guides
- Troubleshooting guide
- API documentation
- Security checklist

**Usage:** Read first for overall understanding

---

### 10. **DEPLOYMENT_GUIDE.md** (Step-by-Step Deployment)
**Purpose:** Detailed instructions for each deployment method  
**Includes:**
- Quick deployment (5 minutes)
- Preparing for production
- Deploy Option A: Simple Node.js Server
  - VPS/Dedicated server setup
  - PM2 configuration
  - Systemd service setup
  - Nginx configuration
  - SSL setup with Let's Encrypt
- Deploy Option B: Docker
  - Building images
  - Running with Docker Compose
  - Cloud deployment
- Deploy Option C: Cloud Providers
  - AWS Elastic Beanstalk
  - Google Cloud Run
  - Azure Container Instances
  - Railway.app, Render.com, Fly.io
- Post-deployment verification
- Troubleshooting

**Usage:** Follow step-by-step based on your chosen platform

---

### 11. **DEPLOYMENT_SUMMARY.md** (Quick Reference)
**Purpose:** Quick overview of deployment process  
**Contains:**
- Project structure overview
- Quick start instructions
- Deployment checklist
- Configuration guide
- Deployment options comparison
- Command reference
- Security recommendations
- Performance considerations
- Troubleshooting quick links

**Usage:** Quick reference while deploying

---

## 🔄 Deployment Workflow

### For Most Users (Simple Node.js + Nginx)

1. **Local Preparation**
   - Edit `.env.example` → `.env`
   - Test locally: `npm run dev`
   
2. **Build for Deployment**
   - Run: `node deploy.js`
   - Output: `deploy-package.zip`
   
3. **Upload to Server**
   - SCP or SFTP `deploy-package.zip`
   
4. **Server Setup**
   - Extract package
   - Install Node.js on server
   - Copy `nginx.conf` to Nginx
   - Copy `.env` with production values
   
5. **Start Application**
   - Using PM2: Follow `pm2.config.js` setup
   - Using systemd: Use example from `DEPLOYMENT_GUIDE.md`
   
6. **Enable HTTPS**
   - Use Let's Encrypt with certbot
   - Configure in `nginx.conf`

### For Docker Users

1. **Local Preparation**
   - Edit `.env` with production values
   - Test locally: `docker-compose up`
   
2. **Build Images**
   - `docker build -t warp-smtp:latest .`
   
3. **Deploy**
   - Push to Docker Hub or private registry
   - Deploy with `docker-compose.yml`
   - Or use platform like AWS ECR, Google Cloud Build

### For Cloud Platform Users

1. **Push Code to GitHub**
   
2. **Connect to Cloud Platform**
   - Platform reads `Dockerfile` automatically
   - Builds and deploys container
   
3. **Set Environment Variables**
   - Use platform's dashboard
   - Add all `.env` variables
   
4. **Done!**
   - Platform handles deployment, scaling, SSL

---

## 🔐 Security Checklist by File

| File | Security Considerations |
|------|------------------------|
| `.env` | ⚠️ Never commit, keep secure, use strong passwords |
| `.env.example` | ✓ Safe to commit, shows structure only |
| `Dockerfile` | ✓ Runs as non-root user, minimal image |
| `docker-compose.yml` | ⚠️ Update env vars before deploying |
| `nginx.conf` | ⚠️ Update domain, enable HTTPS |
| `pm2.config.js` | ⚠️ Update user and paths |
| `README.md` | ✓ Documentation, safe |
| `DEPLOYMENT_GUIDE.md` | ✓ Instructions, safe |

---

## 📋 File Sizes

- `deploy.js` - ~4 KB
- `Dockerfile` - ~1 KB
- `docker-compose.yml` - ~2 KB
- `nginx.conf` - ~3 KB
- `pm2.config.js` - ~2 KB
- `.env.example` - ~1 KB
- `README.md` - ~30 KB
- `DEPLOYMENT_GUIDE.md` - ~25 KB
- `DEPLOYMENT_SUMMARY.md` - ~15 KB

**Total documentation:** ~80 KB

---

## ✅ Pre-Deployment Checklist

Before deploying, ensure:

- [ ] `.env.example` exists and is in version control
- [ ] `.env` is created with production values
- [ ] `.env` is listed in `.gitignore` ✓ (already done)
- [ ] `Dockerfile` is present
- [ ] `docker-compose.yml` is configured
- [ ] `nginx.conf` is present and domain is noted
- [ ] `pm2.config.js` is present with correct paths
- [ ] `deploy.js` is executable and working
- [ ] All documentation files are readable
- [ ] SMTP credentials are tested and working

---

## 🚀 One-Command Deployment

```powershell
# Everything in one go:
node deploy.js
# Then upload deploy-package.zip to your server
```

---

## 📞 File-Specific Help

**I need to deploy on Docker:**  
→ Read `DEPLOYMENT_GUIDE.md` - Deploy Option B

**I need to deploy on a VPS:**  
→ Read `DEPLOYMENT_GUIDE.md` - Deploy Option A

**I'm deploying to AWS/Google/Azure:**  
→ Read `DEPLOYMENT_GUIDE.md` - Deploy Option C

**I need to understand the setup:**  
→ Read `README.md`

**I need a quick overview:**  
→ Read `DEPLOYMENT_SUMMARY.md`

**I need step-by-step instructions:**  
→ Read `DEPLOYMENT_GUIDE.md`

---

## 🔧 Editing Guidelines

### `.env` (Edit Before Each Deployment)
```dotenv
# Change these:
PORT=5000
NODE_ENV=production          # or development
CLIENT_ORIGIN=your-domain    # Match your actual domain
RECEIVER_EMAIL=your@email    # Where emails go
SMTP_USER=your-smtp-user     # SMTP username
SMTP_PASSWORD=app-password   # SMTP password (use App Password for Gmail)
```

### `nginx.conf` (Edit Before Using)
```nginx
# Change these:
server_name your-domain.com www.your-domain.com;  # Your domain here
# Uncomment HTTPS section when ready
```

### `docker-compose.yml` (Edit Before Using)
```yaml
# Verify environment variables section matches your .env
# Especially PORT and CLIENT_ORIGIN
```

### `pm2.config.js` (Edit if Using PM2)
```javascript
// Update paths if different:
// WorkingDirectory=/home/user/dist-deploy/server
// ExecStart=/usr/bin/node /path/to/server/index.js
```

---

## 📞 Support

- **General Help:** See `README.md`
- **Deployment Steps:** See `DEPLOYMENT_GUIDE.md`
- **Quick Reference:** See `DEPLOYMENT_SUMMARY.md`
- **Troubleshooting:** See README.md - Troubleshooting section

---

**Version:** 1.0.0  
**Last Updated:** December 2025  
**All files are ready for production deployment!** ✓
