# WARP SMTP - Step-by-Step Deployment Guide

Complete guide for deploying the WARP SMTP application to production.

## 📑 Table of Contents

1. [Quick Deployment (5 minutes)](#quick-deployment)
2. [Prepare for Production](#prepare-for-production)
3. [Deploy Option A: Simple Node.js Server](#deploy-option-a-simple-nodejs-server)
4. [Deploy Option B: Docker](#deploy-option-b-docker)
5. [Deploy Option C: Cloud Providers](#deploy-option-c-cloud-providers)
6. [Post-Deployment Verification](#post-deployment-verification)

---

## Quick Deployment

### For Development/Testing:

```powershell
# 1. Setup
cd "C:\Users\HP\Desktop\project\Nov 2025\WARP SMPT"
npm install
cd client && npm install && cd ..
cd server && npm install && cd ..

# 2. Configure
copy .env.example .env
# Edit .env with your SMTP credentials

# 3. Build & Run
node deploy.js
# This creates deploy-package.zip ready for upload
```

---

## Prepare for Production

### Step 1: Build the Application

```powershell
# Navigate to project root
cd "C:\Users\HP\Desktop\project\Nov 2025\WARP SMPT"

# Run the deployment script
node deploy.js
```

**Output:** `deploy-package.zip` with your entire application ready to deploy.

### Step 2: Update Environment Variables

**Before uploading, ensure your .env file contains:**

```dotenv
# Server Configuration
PORT=5000
NODE_ENV=production

# CORS Configuration
CLIENT_ORIGIN=https://your-domain.com

# Email Configuration
RECEIVER_EMAIL=your-company-email@example.com
SENDER_EMAIL="Your Company Name <noreply@yourdomain.com>"

# SMTP Configuration (example with Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-16-character-app-password
```

### Step 3: Security Review

Before deployment:

```
[ ] .env is properly configured with production values
[ ] .env is NOT committed to version control
[ ] SMTP credentials are tested and working
[ ] CLIENT_ORIGIN matches your domain
[ ] RECEIVER_EMAIL is accessible
[ ] PORT is not blocked by firewall
[ ] HTTPS/SSL certificate is ready (if using reverse proxy)
```

---

## Deploy Option A: Simple Node.js Server

### For VPS/Dedicated Server (Recommended)

#### Step 1: Prepare Your Server

```bash
# SSH into your server
ssh user@your-server-ip

# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs npm

# Verify installation
node --version
npm --version
```

#### Step 2: Upload Your Application

**Using SCP:**
```powershell
# From your local machine
scp deploy-package.zip user@your-server-ip:/home/user/warp-smtp.zip
```

**Using SFTP/FileZilla:**
1. Open FileZilla
2. Connect to your server
3. Navigate to `/home/user`
4. Upload `deploy-package.zip`

#### Step 3: Extract and Configure

```bash
# SSH into server
ssh user@your-server-ip

# Extract the package
cd /home/user
unzip warp-smtp.zip
cd dist-deploy

# Install server dependencies
cd server
npm install

# Create .env file with production values
nano .env
# Paste your production environment variables
```

#### Step 4: Start the Server

**Option A: Run Directly (Development)**
```bash
cd /home/user/dist-deploy/server
npm start
```

**Option B: Use PM2 (Recommended - Production)**

```bash
# Install PM2 globally
sudo npm install -g pm2

# Navigate to server directory
cd /home/user/dist-deploy/server

# Start with PM2
pm2 start index.js --name "warp-smtp"

# Save configuration
pm2 save

# Enable restart on system reboot
pm2 startup
pm2 save

# Verify it's running
pm2 list
pm2 logs warp-smtp
```

**Option C: Use Systemd (Linux)**

```bash
# Create systemd service file
sudo nano /etc/systemd/system/warp-smtp.service
```

```ini
[Unit]
Description=WARP SMTP Contact Form Application
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/home/user/dist-deploy/server
ExecStart=/usr/bin/node /home/user/dist-deploy/server/index.js
Environment="NODE_ENV=production"
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable warp-smtp
sudo systemctl start warp-smtp

# Check status
sudo systemctl status warp-smtp

# View logs
sudo journalctl -u warp-smtp -f
```

#### Step 5: Configure Web Server (Nginx)

```bash
# Install Nginx
sudo apt-get install -y nginx

# Create Nginx configuration
sudo cp /home/user/dist-deploy/nginx.conf /etc/nginx/sites-available/warp-smtp

# Edit the configuration
sudo nano /etc/nginx/sites-available/warp-smtp
# Update server_name to your domain

# Enable the site
sudo ln -s /etc/nginx/sites-available/warp-smtp /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

#### Step 6: Set Up HTTPS (Let's Encrypt)

```bash
# Install Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Generate SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal test
sudo certbot renew --dry-run

# Enable auto-renewal
sudo systemctl enable certbot.timer
```

### Verification Steps:

```bash
# Check server is listening
sudo netstat -tulpn | grep :5000

# Test API health
curl http://localhost:5000/api/health
# Should return: {"status":"ok"}

# Check Nginx
sudo systemctl status nginx

# View logs
sudo tail -f /var/log/nginx/warp-smtp-access.log
sudo tail -f /var/log/nginx/warp-smtp-error.log
```

---

## Deploy Option B: Docker

### For Docker/Container Platforms

#### Step 1: Prepare Docker Files

Your `deploy-package.zip` already includes:
- `Dockerfile` - Container image definition
- `docker-compose.yml` - Multi-container orchestration
- `.dockerignore` - Files to exclude from image

#### Step 2: Build Docker Image

```powershell
# Extract deploy-package.zip
Expand-Archive deploy-package.zip -DestinationPath .\warp-smtp

# Navigate to directory
cd warp-smtp

# Build the image
docker build -t warp-smtp:latest .

# Or use Docker Compose
docker-compose build
```

#### Step 3: Run with Docker Compose

```powershell
# Ensure .env file exists in the directory
# (It should be included in deploy-package.zip)

# Start the application
docker-compose up -d

# View logs
docker-compose logs -f

# Check status
docker ps
```

#### Step 4: Verify Deployment

```powershell
# Check container is running
docker ps | findstr warp-smtp

# Check logs
docker logs warp-smtp-app

# Test API
curl http://localhost:5000/api/health
```

#### Step 5: Stop/Restart

```powershell
# Stop the application
docker-compose down

# Restart the application
docker-compose up -d

# Rebuild and restart
docker-compose up -d --build
```

---

## Deploy Option C: Cloud Providers

### AWS Elastic Beanstalk

```bash
# Install EB CLI
pip install awsebcli

# Initialize EB application
eb init -p "Node.js 18 running on 64bit Amazon Linux 2" warp-smtp

# Create environment
eb create warp-smtp-env

# Deploy
eb deploy

# View logs
eb logs

# Set environment variables
eb setenv PORT=5000 NODE_ENV=production \
  SMTP_HOST=smtp.gmail.com SMTP_PORT=587 \
  SMTP_USER=your-email@gmail.com \
  SMTP_PASSWORD=your-app-password \
  RECEIVER_EMAIL=company@example.com

# Open in browser
eb open
```

### Google Cloud Run

```bash
# Enable Cloud Run API
gcloud services enable run.googleapis.com

# Build and push image
gcloud builds submit --tag gcr.io/your-project/warp-smtp

# Deploy
gcloud run deploy warp-smtp \
  --image gcr.io/your-project/warp-smtp \
  --platform managed \
  --region us-central1 \
  --set-env-vars PORT=5000,NODE_ENV=production

# Set other variables
gcloud run services update warp-smtp \
  --update-env-vars SMTP_HOST=smtp.gmail.com,SMTP_PORT=587
```

### Azure Container Instances

```bash
# Push to Azure Container Registry
az acr build --registry your-registry --image warp-smtp:latest .

# Deploy container
az container create \
  --resource-group your-rg \
  --name warp-smtp \
  --image your-registry.azurecr.io/warp-smtp:latest \
  --port 5000 \
  --environment-variables PORT=5000 NODE_ENV=production

# View logs
az container logs --resource-group your-rg --name warp-smtp
```

### Heroku Alternative (Railway.app)

```bash
# Install Railway CLI
npm install -g railway

# Login
railway login

# Initialize project
railway init

# Link to project
railway link

# Deploy
railway up

# View logs
railway logs
```

### Render.com

1. Push code to GitHub
2. Create account on [render.com](https://render.com)
3. Create New → Web Service
4. Connect GitHub repository
5. Configure:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `cd server && npm start`
6. Add Environment Variables:
   - `PORT=5000`
   - `NODE_ENV=production`
   - `SMTP_HOST=...`
   - etc.
7. Click Deploy

---

## Post-Deployment Verification

### 1. Test API Health

```bash
# Direct test
curl https://your-domain.com/api/health
# Expected: {"status":"ok"}

# Or from browser
Open https://your-domain.com/api/health
```

### 2. Test Contact Form

1. Open https://your-domain.com in browser
2. Fill out the contact form
3. Submit
4. Check that email is received at RECEIVER_EMAIL

### 3. Check Server Logs

**PM2:**
```bash
pm2 logs warp-smtp
```

**Systemd:**
```bash
journalctl -u warp-smtp -f
```

**Nginx:**
```bash
tail -f /var/log/nginx/warp-smtp-access.log
tail -f /var/log/nginx/warp-smtp-error.log
```

**Docker:**
```bash
docker logs warp-smtp-app -f
```

### 4. Monitor Performance

**Using PM2:**
```bash
pm2 monit
```

**Using Docker:**
```bash
docker stats
```

### 5. Set Up Monitoring/Alerts

Consider using:
- **PM2 Plus** - Built-in monitoring
- **New Relic** - Application monitoring
- **DataDog** - Infrastructure monitoring
- **Sentry** - Error tracking
- **StatusPage.io** - Status monitoring

---

## Troubleshooting Deployment

### Issue: "Cannot connect to application"

**Solution:**
1. Check server is running: `pm2 list` or `systemctl status warp-smtp`
2. Check firewall: `sudo ufw status` or check cloud security groups
3. Check port: `netstat -tulpn | grep 5000`
4. Check Nginx: `sudo nginx -t` and `sudo systemctl status nginx`

### Issue: "SMTP authentication failed"

**Solution:**
1. Verify .env credentials
2. For Gmail: Ensure App Password is used
3. Test credentials locally first
4. Check logs: `pm2 logs warp-smtp`

### Issue: "CORS error in browser"

**Solution:**
1. Update CLIENT_ORIGIN in .env to match your domain
2. Restart server: `pm2 restart warp-smtp`
3. Clear browser cache

### Issue: "Email not sending"

**Solution:**
1. Check RECEIVER_EMAIL is valid
2. Check spam folder
3. Verify SMTP credentials are correct
4. Check server logs for detailed error
5. Test with Mailtrap first (free testing service)

### Issue: "Application crashed"

**Solution:**
1. Check logs: `pm2 logs warp-smtp --err`
2. Check disk space: `df -h`
3. Check memory: `free -h`
4. Restart: `pm2 restart warp-smtp`

---

## Maintenance Tasks

### Regular Updates

```bash
# Update Node.js
sudo apt-get install -y nodejs

# Update npm packages
cd /home/user/dist-deploy/server
npm outdated  # Check for updates
npm update    # Update packages

# Update system
sudo apt update && sudo apt upgrade -y
```

### Backup Configuration

```bash
# Backup .env file
cp /home/user/dist-deploy/.env /home/user/backups/.env.backup

# Backup logs
cp /var/log/nginx/warp-smtp-*.log /home/user/backups/logs/
```

### Check Disk Space

```bash
# View disk usage
df -h
du -sh /home/user/dist-deploy

# Clean up old logs
find /var/log -name "*.log" -type f -mtime +30 -delete
```

---

## Support & Resources

- **Nodemailer Issues:** [Nodemailer Docs](https://nodemailer.com/)
- **Express Issues:** [Express Docs](https://expressjs.com/)
- **PM2 Issues:** [PM2 Docs](https://pm2.io/)
- **Nginx Issues:** [Nginx Docs](https://nginx.org/)
- **Docker Issues:** [Docker Docs](https://docs.docker.com/)

---

**Version:** 1.0.0  
**Last Updated:** December 2025
