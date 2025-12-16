#!/usr/bin/env node

// ============================================================================
// WARP SMTP - Deployment Script
// Builds frontend (React Vite) and packages with backend (Express Node.js)
// for production deployment
// ============================================================================

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function run(cmd, silent = false) {
  try {
    if (!silent) log(`▶ ${cmd}`, 'blue');
    execSync(cmd, { stdio: silent ? 'pipe' : 'inherit' });
  } catch (error) {
    log(`✗ Command failed: ${cmd}`, 'red');
    process.exit(1);
  }
}

function buildClient() {
  log('\n📦 Building React Client (Vite)...', 'green');
  try {
    run('cd client && npm install', true);
    run('cd client && npm run build', false);
    log('✓ Client build completed successfully', 'green');
  } catch (error) {
    log('✗ Client build failed', 'red');
    throw error;
  }
}

function prepareServer() {
  log('\n📦 Preparing Express Server...', 'green');
  try {
    run('cd server && npm install', true);
    log('✓ Server dependencies installed successfully', 'green');
  } catch (error) {
    log('✗ Server preparation failed', 'red');
    throw error;
  }
}

function createDeployPackage() {
  log('\n📦 Creating Deployment Package...', 'green');
  
  const deployDir = path.join(__dirname, 'dist-deploy');
  const outputZip = path.join(__dirname, 'deploy-package.zip');

  // Clean up existing deployment directory
  if (fs.existsSync(deployDir)) {
    run(`powershell "Remove-Item -Path '${deployDir}' -Recurse -Force"`, true);
  }

  // Create deployment directory structure
  fs.mkdirSync(deployDir, { recursive: true });
  fs.mkdirSync(path.join(deployDir, 'server'), { recursive: true });
  fs.mkdirSync(path.join(deployDir, 'public'), { recursive: true });

  // Copy client dist to public folder
  const clientDist = path.join(__dirname, 'client', 'dist');
  const publicDir = path.join(deployDir, 'public');
  
  if (fs.existsSync(clientDist)) {
    log('   Copying client build...', 'blue');
    run(`powershell "Copy-Item -Path '${clientDist}\\*' -Destination '${publicDir}' -Recurse"`, true);
  }

  // Copy server files
  log('   Copying server files...', 'blue');
  const serverFiles = ['index.js', 'package.json', 'package-lock.json'];
  serverFiles.forEach(file => {
    const src = path.join(__dirname, 'server', file);
    const dst = path.join(deployDir, 'server', file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dst);
    }
  });

  // Copy server directories
  ['routes', 'controllers', 'utils'].forEach(dir => {
    const src = path.join(__dirname, 'server', dir);
    const dst = path.join(deployDir, 'server', dir);
    if (fs.existsSync(src)) {
      run(`powershell "Copy-Item -Path '${src}' -Destination '${dst}' -Recurse"`, true);
    }
  });

  // Copy .env (warning about security)
  log('   Copying environment configuration...', 'blue');
  const envSrc = path.join(__dirname, '.env');
  const envDst = path.join(deployDir, '.env');
  if (fs.existsSync(envSrc)) {
    fs.copyFileSync(envSrc, envDst);
    log('   ⚠ WARNING: .env file included. Ensure it\'s not committed to version control!', 'yellow');
  }

  // Create deployment instructions
  const instructions = `WARP SMTP - DEPLOYMENT INSTRUCTIONS
=====================================

1. EXTRACT the deployment package:
   - Extract deploy-package.zip to your server/hosting environment

2. INSTALL DEPENDENCIES (if not already installed):
   cd server
   npm install

3. CONFIGURE ENVIRONMENT:
   - Update the .env file with your production credentials:
     * PORT: Set to your desired port (default: 5000)
     * SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD: Your email service credentials
     * RECEIVER_EMAIL: Where contact form emails will be sent
     * CLIENT_ORIGIN: Update CORS origin to your client URL

4. START THE SERVER:
   # Development with auto-reload:
   npm run dev

   # Production:
   npm start

5. ACCESS YOUR APPLICATION:
   - Frontend: http://your-domain.com:${process.env.PORT || 5000}
   - Health Check: http://your-domain.com:${process.env.PORT || 5000}/api/health

6. PRODUCTION DEPLOYMENT (Recommended):
   Use a process manager to keep the server running:
   
   Option A - PM2:
   npm install -g pm2
   pm2 start server/index.js --name "warp-smtp"
   pm2 save
   pm2 startup

   Option B - systemd (Linux):
   Create /etc/systemd/system/warp-smtp.service with appropriate config
   systemctl start warp-smtp
   systemctl enable warp-smtp

   Option C - Docker:
   Create a Dockerfile in the deployment package root and deploy with Docker Compose

7. SECURITY CONSIDERATIONS:
   - Never commit .env to version control
   - Use strong SMTP passwords (consider email service app passwords)
   - Set up HTTPS/SSL for production
   - Implement rate limiting for the contact form endpoint
   - Use environment-specific .env files

For support, refer to the main README.md file.
`;

  const instructionsFile = path.join(deployDir, 'DEPLOYMENT_INSTRUCTIONS.txt');
  fs.writeFileSync(instructionsFile, instructions);
  log('   Created deployment instructions', 'blue');

  // Remove existing zip
  if (fs.existsSync(outputZip)) {
    fs.unlinkSync(outputZip);
  }

  // Create zip archive
  log('   Creating archive...', 'blue');
  run(`powershell "Compress-Archive -Path '${deployDir}\\*' -DestinationPath '${outputZip}'"`, true);
  
  log(`✓ Deployment package created: ${outputZip}`, 'green');

  return outputZip;
}

function main() {
  log('\n╔═══════════════════════════════════════════════╗', 'blue');
  log('║      WARP SMTP - PRODUCTION DEPLOYMENT       ║', 'blue');
  log('╚═══════════════════════════════════════════════╝', 'blue');

  try {
    buildClient();
    prepareServer();
    const zipFile = createDeployPackage();

    log('\n╔═══════════════════════════════════════════════╗', 'green');
    log('║          DEPLOYMENT SUCCESSFUL! ✓            ║', 'green');
    log('╚═══════════════════════════════════════════════╝', 'green');
    log(`\n📦 Deployment Package: ${zipFile}`, 'green');
    log('\n📋 Next Steps:');
    log('   1. Upload deploy-package.zip to your server', 'blue');
    log('   2. Extract: unzip deploy-package.zip', 'blue');
    log('   3. Configure: Update .env with production values', 'blue');
    log('   4. Install: cd server && npm install', 'blue');
    log('   5. Start: npm start (or use PM2 for production)', 'blue');
    log('\n📖 See DEPLOYMENT_INSTRUCTIONS.txt for detailed steps\n', 'blue');
  } catch (error) {
    log('\n✗ Deployment failed!', 'red');
    log(error.message, 'red');
    process.exit(1);
  }
}

main();
