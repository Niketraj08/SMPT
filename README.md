# WARP SMTP - Company Contact Form Application

A modern, full-stack contact form application with SMTP email integration. Built with React (Vite) frontend and Node.js/Express backend with Nodemailer for email delivery.

## 📋 Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Development](#development)
- [Building for Production](#building-for-production)
- [Deployment Guides](#deployment-guides)
- [Environment Configuration](#environment-configuration)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## ✨ Features

- **Modern React Frontend** - Built with Vite for fast development and production builds
- **Express Backend** - Lightweight Node.js server with robust error handling
- **Email Integration** - Nodemailer SMTP support for Gmail, Mailtrap, Brevo, and custom SMTP
- **Form Validation** - Client and server-side validation with detailed error messages
- **Responsive Design** - Tailwind CSS for mobile-friendly interface
- **CORS Support** - Configured for secure cross-origin requests
- **Health Checks** - Built-in API health endpoint for monitoring
- **Environment Management** - Flexible configuration through .env files
- **Docker Support** - Easy containerization and deployment

---

## 📁 Project Structure

```
WARP SMTP/
├── client/                     # React Vite Frontend
│   ├── src/
│   │   ├── components/         # React components
│   │   │   └── Form.jsx       # Contact form component
│   │   ├── pages/             # Page components
│   │   │   └── Contact.jsx    # Contact page
│   │   ├── App.jsx            # Main app component
│   │   ├── main.jsx           # Entry point
│   │   └── index.css          # Global styles
│   ├── public/                # Static assets
│   ├── package.json           # Frontend dependencies
│   ├── vite.config.js         # Vite configuration
│   ├── tailwind.config.js     # Tailwind CSS config
│   └── postcss.config.js      # PostCSS config
│
├── server/                     # Express Backend
│   ├── controllers/           # Request handlers
│   │   └── mailController.js  # Email handling logic
│   ├── routes/                # API routes
│   │   └── mail.js            # Email endpoints
│   ├── utils/                 # Utilities
│   │   └── sendMail.js        # Nodemailer configuration
│   ├── index.js               # Server entry point
│   └── package.json           # Backend dependencies
│
├── .env                        # Environment variables (local)
├── .env.example               # Example environment file
├── deploy.js                  # Deployment script
├── docker-compose.yml         # Docker Compose config
├── Dockerfile                 # Docker container config
├── nginx.conf                 # Nginx reverse proxy config
├── pm2.config.js              # PM2 process manager config
├── package.json               # Root package.json
└── README.md                  # This file
```

---

## 📋 Prerequisites

Before you begin, ensure you have installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (v9 or higher) - Comes with Node.js
- **Git** (optional) - For version control
- **Docker** (optional) - For containerized deployment

### SMTP Provider Account

You'll need email service credentials. Choose one:

**Gmail:**
- Google Account with 2-Factor Authentication enabled
- App Password from [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)

**Mailtrap (Testing):**
- Free account at [mailtrap.io](https://mailtrap.io)
- SMTP credentials from dashboard

**Brevo (formerly Sendinblue):**
- Account at [brevo.com](https://www.brevo.com)
- SMTP API key from settings

**Other Services:**
- AWS SES, SendGrid, Mailgun, etc. (use their SMTP endpoints)

---

## 🚀 Installation & Setup

### Step 1: Clone or Extract the Project

```powershell
cd "C:\Users\HP\Desktop\project\Nov 2025\WARP SMPT"
```

### Step 2: Install Root Dependencies

```powershell
npm install
```

### Step 3: Install Client & Server Dependencies

```powershell
# Install client dependencies
cd client
npm install
cd ..

# Install server dependencies
cd server
npm install
cd ..
```

### Step 4: Configure Environment Variables

```powershell
# Copy example file
copy .env.example .env

# Edit .env with your SMTP credentials
notepad .env
```

**Required Environment Variables:**

```dotenv
# Server
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173

# Email Configuration
RECEIVER_EMAIL=your-company@example.com
SENDER_EMAIL="Your Company <noreply@example.com>"

# SMTP Configuration (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### Step 5: Verify Setup

```powershell
# Check Node.js version
node --version

# Check npm version
npm --version

# Verify client build
cd client && npm run build && cd ..

# Verify server starts
cd server && npm start
```

---

## 💻 Development

### Start Both Frontend & Backend

```powershell
# From root directory
npm run dev
```

This will start:
- **Frontend:** http://localhost:5173 (Vite dev server with hot reload)
- **Backend:** http://localhost:5000 (Express server)

### Start Separately

```powershell
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend  
cd client
npm run dev
```

### Test Email Submission

1. Open http://localhost:5173
2. Fill out the contact form
3. Submit
4. Check your email (RECEIVER_EMAIL)

### Check Server Health

```powershell
curl http://localhost:5000/api/health
# Response: {"status":"ok"}
```

---

## 🏗️ Building for Production

### Option 1: Automated Deployment Script

The easiest way to prepare for deployment:

```powershell
# From root directory
node deploy.js
```

This script will:
1. Build the React frontend (Vite)
2. Install server dependencies
3. Package everything into `deploy-package.zip`
4. Create deployment instructions

### Option 2: Manual Build

```powershell
# Build client
cd client
npm run build
cd ..

# Verify server installation
cd server
npm install
cd ..
```

---

## 📦 Deployment Guides

### Quick Start: Local Testing in Production Mode

```powershell
# Build client
cd client && npm run build && cd ..

# Start server in production mode
cd server
npm start
```

Then access the app at `http://localhost:5000`

---

### Deployment Option 1: Node.js Server (Recommended for Most)

#### 1. **Deploy to Your Own Server/VPS**

**Upload Files:**
```powershell
# Run deployment script
node deploy.js

# Upload deploy-package.zip to your server via:
# - SCP: scp deploy-package.zip user@your-server:/path/to/app
# - SFTP: Use FileZilla or WinSCP
# - FTP: Use your hosting control panel
```

**On Your Server:**
```bash
# Extract the package
unzip deploy-package.zip
cd server

# Install dependencies
npm install

# Start the server
npm start
```

**Keep Server Running:**

Using PM2 (Recommended):
```bash
npm install -g pm2
pm2 start index.js --name "warp-smtp"
pm2 save
pm2 startup
```

Using systemd (Linux):
```bash
sudo nano /etc/systemd/system/warp-smtp.service
```

```ini
[Unit]
Description=WARP SMTP Contact Form
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/warp-smtp
ExecStart=/usr/bin/node /path/to/warp-smtp/server/index.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable warp-smtp
sudo systemctl start warp-smtp
```

---

### Deployment Option 2: Docker (Scalable & Modern)

#### 1. **Build Docker Image**

```powershell
# Build the image
docker build -t warp-smtp:latest .

# Or use Docker Compose (recommended)
docker-compose build
```

#### 2. **Run with Docker Compose**

```powershell
# Create .env file with your credentials (if not exists)
# See .env.example for reference

# Start the application
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down
```

#### 3. **Deploy to Cloud**

**AWS ECS/Fargate:**
```bash
# Push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin your-account-id.dkr.ecr.us-east-1.amazonaws.com
docker tag warp-smtp:latest your-account-id.dkr.ecr.us-east-1.amazonaws.com/warp-smtp:latest
docker push your-account-id.dkr.ecr.us-east-1.amazonaws.com/warp-smtp:latest
```

**Google Cloud Run:**
```bash
docker tag warp-smtp:latest gcr.io/your-project/warp-smtp
docker push gcr.io/your-project/warp-smtp
gcloud run deploy warp-smtp --image gcr.io/your-project/warp-smtp
```

**Azure Container Instances:**
```bash
az acr build --registry your-registry --image warp-smtp:latest .
az container create --resource-group your-rg --name warp-smtp --image your-registry.azurecr.io/warp-smtp:latest
```

---

### Deployment Option 3: Nginx Reverse Proxy

Use the provided `nginx.conf` for production setup:

```bash
# Copy configuration
sudo cp nginx.conf /etc/nginx/sites-available/warp-smtp

# Enable site
sudo ln -s /etc/nginx/sites-available/warp-smtp /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

Update the domain in nginx.conf before deploying.

---

### Deployment Option 4: PM2 with Clustering

```bash
# Install PM2 globally
npm install -g pm2

# Start with PM2 config
pm2 start pm2.config.js

# Save configuration
pm2 save

# Enable auto-restart on system boot
pm2 startup
pm2 save

# Monitor
pm2 monit

# View logs
pm2 logs
```

---

### Deployment Option 5: Heroku (Deprecated - Use Alternative)

Since Heroku free tier is discontinued, use alternatives:

**Railway.app:**
```bash
npm install -g railway
railway login
railway init
railway up
```

**Render.com:**
1. Push code to GitHub
2. Connect Render to GitHub
3. Create new "Web Service"
4. Set environment variables
5. Deploy

**Fly.io:**
```bash
npm install -g flyctl
flyctl auth login
flyctl launch
flyctl deploy
```

---

### Deployment Option 6: AWS EC2

**1. Launch EC2 Instance:**
- Ubuntu 22.04 LTS recommended
- Security Group: Open ports 80, 443, 22

**2. SSH into Instance:**
```bash
ssh -i your-key.pem ubuntu@your-instance-ip
```

**3. Install Node.js:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

**4. Deploy Application:**
```bash
cd /var/www
sudo git clone your-repo warp-smtp
cd warp-smtp
npm install
cd server && npm install && cd ..

# Create .env file with production credentials
sudo nano .env

# Start with PM2
npm install -g pm2
pm2 start server/index.js --name "warp-smtp"
pm2 startup
pm2 save
```

**5. Set Up Nginx:**
```bash
sudo apt-get install nginx
# Copy and configure nginx.conf
sudo systemctl restart nginx
```

**6. Set Up SSL (Let's Encrypt):**
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

### Deployment Option 7: DigitalOcean App Platform

**1. Push to GitHub**

**2. Connect to DigitalOcean:**
- Create DigitalOcean account
- Link GitHub repository
- Create new App

**3. Configure:**
- Service: Node.js
- Build Command: `npm install && npm run build`
- Run Command: `cd server && npm start`
- Port: 5000

**4. Set Environment Variables** in Dashboard:
```
PORT=5000
NODE_ENV=production
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
RECEIVER_EMAIL=company@example.com
```

**5. Deploy**

---

## 🔧 Environment Configuration

### SMTP Providers Setup Guide

#### Gmail Setup

1. Enable 2-Factor Authentication:
   - Go to [myaccount.google.com](https://myaccount.google.com)
   - Security → 2-Step Verification

2. Create App Password:
   - [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - Select Mail → Windows Computer
   - Copy the 16-character password

3. Update .env:
```dotenv
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

#### Mailtrap Setup (Recommended for Testing)

1. Sign up at [mailtrap.io](https://mailtrap.io)
2. Create a testing inbox
3. Copy SMTP credentials from Integration tab
4. Update .env:
```dotenv
SMTP_HOST=live.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your-mailtrap-user
SMTP_PASSWORD=your-mailtrap-password
```

#### Brevo Setup

1. Sign up at [brevo.com](https://www.brevo.com)
2. Go to SMTP & API → SMTP tab
3. Copy credentials
4. Update .env:
```dotenv
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASSWORD=your-brevo-smtp-key
```

---

## 🐛 Troubleshooting

### Issue: "Cannot find module 'nodemailer'"

**Solution:**
```powershell
cd server
npm install nodemailer
```

### Issue: "SMTP Authentication Failed"

**Solution:**
- Verify credentials in .env
- For Gmail: Ensure App Password is used, not regular password
- Check SMTP_USER and SMTP_PASSWORD for typos
- Test credentials: `npm run dev` and check console logs

### Issue: "CORS Error: Access-Control-Allow-Origin"

**Solution:**
Update .env:
```dotenv
CLIENT_ORIGIN=http://your-frontend-domain.com
```

### Issue: "Port 5000 already in use"

**Solution:**
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process
taskkill /PID process-id /F

# Or change port in .env
PORT=5001
```

### Issue: "Email not sending but no error"

**Solution:**
- Check RECEIVER_EMAIL is valid
- Check spam folder
- Enable "Less secure apps" for Gmail (if not using App Password)
- Check server logs for detailed errors

### Issue: Form submission hangs or times out

**Solution:**
- Check SMTP credentials are correct
- Test with Mailtrap first
- Increase timeout in sendMail.js:
```javascript
connectionTimeout: 15000,  // Increase from 10000
```

---

## 📊 Monitoring & Logs

### View Server Logs (PM2)

```bash
# Real-time logs
pm2 logs warp-smtp

# All logs
pm2 logs

# Clear logs
pm2 flush
```

### View Systemd Logs

```bash
journalctl -u warp-smtp -f
journalctl -u warp-smtp --since "10 minutes ago"
```

### Docker Logs

```bash
# View logs
docker-compose logs -f warp-smtp-app

# View last 50 lines
docker-compose logs --tail=50 warp-smtp-app
```

### Health Check

```bash
# API health check
curl http://your-domain.com/api/health

# Expected response
{"status":"ok"}
```

---

## 🔐 Security Checklist

Before deploying to production:

- [ ] Copy `.env.example` to `.env` and fill actual values
- [ ] Never commit `.env` to version control
- [ ] Use strong SMTP passwords or app-specific passwords
- [ ] Enable HTTPS/SSL (Let's Encrypt recommended)
- [ ] Set up firewall rules to restrict access
- [ ] Use environment-specific `.env` files for each deployment
- [ ] Enable rate limiting on contact form endpoint
- [ ] Set up monitoring and alerting
- [ ] Regular backups of configuration
- [ ] Use PM2 or systemd to auto-restart service
- [ ] Keep Node.js and dependencies updated
- [ ] Use strong authentication for admin access

---

## 📞 API Endpoints

### Health Check

```
GET /api/health
Response: { "status": "ok" }
```

### Send Contact Email

```
POST /api/mail
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "subject": "Inquiry",
  "message": "Hello, I have a question..."
}

Success Response (200):
{
  "success": true,
  "message": "Email sent successfully"
}

Error Response (400/500):
{
  "success": false,
  "message": "Error description",
  "errors": { "fieldName": "error message" }
}
```

---

## 📝 License

MIT License - Feel free to use and modify for your projects.

---

## 📚 Additional Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Nodemailer Documentation](https://nodemailer.com/)
- [Docker Documentation](https://docs.docker.com/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [PM2 Documentation](https://pm2.io/)

---

## 🤝 Support

For issues or questions:

1. Check the **Troubleshooting** section above
2. Review server logs with `npm run dev`
3. Test with [Mailtrap](https://mailtrap.io) for SMTP issues
4. Ensure all environment variables are correctly set

---

**Last Updated:** December 2025
**Version:** 1.0.0
