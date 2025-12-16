// ============================================================================
// WARP SMTP - PM2 Process Manager Configuration
// Usage: pm2 start pm2.config.js
// ============================================================================

module.exports = {
  apps: [
    {
      name: 'warp-smtp',
      script: './server/index.js',
      instances: 'max',
      exec_mode: 'cluster',
      
      // Environment variables
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
      
      // Logging
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      
      // Auto-restart
      watch: false,
      max_memory_restart: '500M',
      
      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,
      
      // Restart policies
      max_restarts: 10,
      min_uptime: '10s',
      autorestart: true,
      
      // Merge logs from cluster instances
      merge_logs: true,
    },
  ],
  
  // Cluster management
  deploy: {
    production: {
      user: 'www-data',
      host: 'your-server.com',
      ref: 'origin/main',
      repo: 'git@github.com:your-repo/warp-smtp.git',
      path: '/var/www/warp-smtp',
      'post-deploy': 'npm install && npm run build && pm2 reload pm2.config.js --env production',
    },
  },
};
