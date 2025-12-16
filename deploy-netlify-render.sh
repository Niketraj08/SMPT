#!/bin/bash
# WARP SMTP Deployment Script for Netlify & Render
# This script automates the deployment process

set -e

echo "🚀 WARP SMTP - Netlify & Render Deployment Script"
echo "=================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[⚠]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

# Check if Git is initialized
if [ ! -d ".git" ]; then
    print_warning "Git repository not initialized"
    echo "Initializing Git repository..."
    git init
    git branch -M main
fi

# Function to build frontend
build_frontend() {
    print_status "Building frontend..."
    cd client
    npm install
    npm run build
    print_success "Frontend build completed"
    cd ..
}

# Function to prepare backend
prepare_backend() {
    print_status "Preparing backend..."
    cd server
    npm install
    print_success "Backend dependencies installed"
    cd ..
}

# Function to check environment variables
check_env() {
    print_status "Checking environment variables..."
    
    if [ ! -f ".env" ]; then
        print_warning ".env file not found"
        print_status "Creating .env from .env.example..."
        cp .env.example .env
        print_warning "Please edit .env with your credentials:"
        print_warning "  - SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD"
        print_warning "  - CLIENT_ORIGIN"
        echo ""
        read -p "Press Enter after updating .env file..."
    else
        print_success ".env file exists"
    fi
}

# Function to commit changes
commit_changes() {
    print_status "Preparing Git commit..."
    
    git add .
    
    if git diff-index --quiet HEAD --; then
        print_status "No changes to commit"
    else
        git commit -m "Deploy: Netlify & Render configuration - $(date +'%Y-%m-%d %H:%M:%S')"
        print_success "Changes committed"
    fi
}

# Function to display next steps
show_deployment_steps() {
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}Deployment Steps:${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo -e "${YELLOW}1. DEPLOY BACKEND TO RENDER${NC}"
    echo "   - Go to https://dashboard.render.com"
    echo "   - Click 'New +' > 'Web Service'"
    echo "   - Connect your GitHub repository"
    echo "   - Set Root Directory: 'server'"
    echo "   - Build Command: 'npm install'"
    echo "   - Start Command: 'npm start'"
    echo "   - Add Environment Variables from .env"
    echo "   - Deploy and note the service URL"
    echo ""
    echo -e "${YELLOW}2. DEPLOY FRONTEND TO NETLIFY${NC}"
    echo "   - Go to https://app.netlify.com"
    echo "   - Click 'Connect Git Repository'"
    echo "   - Select your repository"
    echo "   - Base Directory: 'client'"
    echo "   - Build Command: 'npm run build'"
    echo "   - Publish Directory: 'dist'"
    echo "   - Add Environment Variable:"
    echo "     VITE_API_URL=<your-render-backend-url>"
    echo "   - Deploy and note the site URL"
    echo ""
    echo -e "${YELLOW}3. UPDATE BACKEND CLIENT_ORIGIN${NC}"
    echo "   - Go back to Render dashboard"
    echo "   - Update CLIENT_ORIGIN with your Netlify URL"
    echo "   - Service will redeploy automatically"
    echo ""
    echo -e "${YELLOW}4. TEST${NC}"
    echo "   - Visit your Netlify site"
    echo "   - Fill and submit the contact form"
    echo "   - Verify you receive an email"
    echo ""
}

# Main execution
main() {
    print_status "Starting deployment preparation..."
    echo ""
    
    # Step 1: Build and prepare
    print_status "Step 1/4: Building frontend..."
    build_frontend
    echo ""
    
    print_status "Step 2/4: Preparing backend..."
    prepare_backend
    echo ""
    
    # Step 2: Check environment
    print_status "Step 3/4: Checking environment..."
    check_env
    echo ""
    
    # Step 3: Commit
    print_status "Step 4/4: Committing changes..."
    commit_changes
    echo ""
    
    # Step 4: Show deployment steps
    show_deployment_steps
    
    print_success "Pre-deployment checks completed!"
}

# Run main function
main
