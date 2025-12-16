# ============================================================================
# WARP SMTP - Docker Configuration
# Build and deploy the application using Docker
# ============================================================================

# Stage 1: Build React Client
FROM node:18-alpine AS client-builder
WORKDIR /app/client

# Copy client package files
COPY client/package*.json ./

# Install dependencies
RUN npm ci

# Copy client source
COPY client ./

# Build client
RUN npm run build

# ============================================================================
# Stage 2: Production Server Image
FROM node:18-alpine

WORKDIR /app

# Install dumb-init to handle signals properly
RUN apk add --no-cache dumb-init

# Copy server package files
COPY server/package*.json ./server/

# Install server dependencies
WORKDIR /app/server
RUN npm ci --only=production

# Go back to app root
WORKDIR /app

# Copy server source files
COPY server ./server

# Copy built client from stage 1
COPY --from=client-builder /app/client/dist ./public

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start server
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server/index.js"]
