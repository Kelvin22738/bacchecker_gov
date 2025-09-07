# BacChecker Installation Guide

## System Requirements

### Minimum Requirements
- **Node.js**: Version 18.0 or higher
- **npm**: Version 8.0 or higher
- **Memory**: 4GB RAM minimum
- **Storage**: 10GB available space
- **Network**: Stable internet connection

### Recommended Requirements
- **Node.js**: Version 20.0 or higher
- **Memory**: 8GB RAM or more
- **Storage**: 50GB available space
- **CPU**: Multi-core processor
- **Network**: High-speed internet connection

## Installation Methods

### Method 1: Development Setup

#### Prerequisites
1. **Install Node.js**:
   ```bash
   # Download from https://nodejs.org/
   # Verify installation
   node --version
   npm --version
   ```

2. **Clone Repository**:
   ```bash
   git clone https://github.com/bacchecker/government-suite.git
   cd government-suite
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Environment Configuration**:
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Edit environment variables
   nano .env
   ```

5. **Start Development Server**:
   ```bash
   npm run dev
   ```

### Method 2: Production Deployment

#### Using Netlify (Recommended)
1. **Build Application**:
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**:
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli
   
   # Deploy
   netlify deploy --prod --dir=dist
   ```

#### Using Docker
1. **Create Dockerfile**:
   ```dockerfile
   FROM node:20-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. **Build and Run**:
   ```bash
   docker build -t bacchecker .
   docker run -p 3000:3000 bacchecker
   ```

## Database Setup

### Supabase Configuration

#### 1. Create Supabase Project
1. Visit [Supabase Dashboard](https://supabase.com/dashboard)
2. Create new project
3. Note your project URL and API keys

#### 2. Run Database Migrations
```bash
# Install Supabase CLI
npm install -g supabase

# Initialize Supabase
supabase init

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Run migrations
supabase db push
```

#### 3. Configure Environment Variables
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Database Schema
The platform uses the following main tables:
- `tertiary_institutions` - Institution registry
- `verification_requests` - Verification workflow
- `document_submissions` - Document management
- `verification_phases` - Workflow phases
- `fraud_registry` - Fraud prevention
- `verification_reports` - Report generation

## Environment Configuration

### Required Environment Variables
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Application Configuration
VITE_APP_NAME=BacChecker Government Suite
VITE_APP_VERSION=2.0.0
VITE_APP_ENV=production

# API Configuration
VITE_API_BASE_URL=https://api.bacchecker.gov.gh/v1
VITE_API_TIMEOUT=30000

# Security Configuration
VITE_ENCRYPTION_KEY=your-encryption-key
VITE_JWT_SECRET=your-jwt-secret

# External Services
VITE_PAYSTACK_PUBLIC_KEY=pk_live_your-paystack-key
VITE_STRIPE_PUBLIC_KEY=pk_live_your-stripe-key

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@bacchecker.gov.gh
SMTP_PASS=your-email-password

# File Storage
VITE_STORAGE_BUCKET=bacchecker-documents
VITE_CDN_URL=https://cdn.bacchecker.gov.gh
```

### Optional Environment Variables
```env
# Analytics
VITE_GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
VITE_MIXPANEL_TOKEN=your-mixpanel-token

# Monitoring
VITE_SENTRY_DSN=https://your-sentry-dsn
VITE_LOGFLARE_API_KEY=your-logflare-key

# Feature Flags
VITE_ENABLE_FRAUD_DETECTION=true
VITE_ENABLE_ADVANCED_ANALYTICS=true
VITE_ENABLE_MOBILE_APP=false
```

## Security Configuration

### SSL/TLS Setup
1. **Obtain SSL Certificate**:
   - Use Let's Encrypt for free certificates
   - Or purchase from trusted CA

2. **Configure HTTPS**:
   ```nginx
   server {
       listen 443 ssl;
       server_name bacchecker.gov.gh;
       
       ssl_certificate /path/to/certificate.crt;
       ssl_certificate_key /path/to/private.key;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

### Firewall Configuration
```bash
# Allow HTTP and HTTPS traffic
sudo ufw allow 80
sudo ufw allow 443

# Allow SSH (if needed)
sudo ufw allow 22

# Enable firewall
sudo ufw enable
```

## Performance Optimization

### Build Optimization
```javascript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@headlessui/react', 'lucide-react'],
          utils: ['date-fns', 'clsx']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
});
```

### Caching Strategy
```nginx
# Static assets caching
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# HTML files
location ~* \.html$ {
    expires 1h;
    add_header Cache-Control "public";
}
```

## Monitoring Setup

### Application Monitoring
1. **Install Monitoring Tools**:
   ```bash
   npm install @sentry/react @sentry/tracing
   ```

2. **Configure Sentry**:
   ```javascript
   import * as Sentry from "@sentry/react";
   
   Sentry.init({
     dsn: process.env.VITE_SENTRY_DSN,
     environment: process.env.VITE_APP_ENV,
     tracesSampleRate: 1.0,
   });
   ```

### Health Checks
Create health check endpoints:
```javascript
// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.VITE_APP_VERSION,
    uptime: process.uptime()
  });
});
```

## Backup and Recovery

### Database Backup
```bash
# Automated daily backup
supabase db dump --file backup-$(date +%Y%m%d).sql

# Restore from backup
supabase db reset --file backup-20240630.sql
```

### File Backup
```bash
# Backup uploaded documents
rsync -av /var/www/bacchecker/uploads/ /backup/uploads/

# Backup configuration files
tar -czf config-backup-$(date +%Y%m%d).tar.gz /etc/bacchecker/
```

## Troubleshooting

### Common Installation Issues

#### Node.js Version Issues
```bash
# Install Node Version Manager
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install and use Node.js 20
nvm install 20
nvm use 20
```

#### Permission Issues
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules
```

#### Build Failures
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Database Connection Issues
1. **Check Supabase Status**: Verify Supabase service status
2. **Validate Credentials**: Ensure API keys are correct
3. **Network Connectivity**: Test connection to Supabase
4. **Firewall Rules**: Check firewall configurations

### Performance Issues
1. **Memory Usage**: Monitor Node.js memory consumption
2. **Database Queries**: Optimize slow database queries
3. **Asset Loading**: Optimize image and asset sizes
4. **Network Latency**: Use CDN for static assets

## Maintenance

### Regular Maintenance Tasks

#### Daily
- Monitor system health and performance
- Check error logs and alerts
- Verify backup completion
- Review security logs

#### Weekly
- Update dependencies (security patches)
- Review performance metrics
- Clean up temporary files
- Test backup restoration

#### Monthly
- Full system backup
- Security audit and review
- Performance optimization
- Capacity planning review

### Update Procedures
1. **Backup Current System**:
   ```bash
   # Create full backup
   ./scripts/backup-system.sh
   ```

2. **Test Updates in Staging**:
   ```bash
   # Deploy to staging environment
   npm run deploy:staging
   ```

3. **Deploy to Production**:
   ```bash
   # Deploy to production
   npm run deploy:production
   ```

4. **Verify Deployment**:
   ```bash
   # Run health checks
   ./scripts/health-check.sh
   ```

## Security Hardening

### Application Security
- Enable HTTPS everywhere
- Implement Content Security Policy (CSP)
- Use secure session management
- Regular security audits

### Database Security
- Enable Row Level Security (RLS)
- Use parameterized queries
- Regular security updates
- Access logging and monitoring

### Infrastructure Security
- Regular OS updates
- Firewall configuration
- Intrusion detection
- Access control and monitoring

## Support

### Technical Support
- **Email**: tech-support@bacchecker.gov.gh
- **Phone**: +233-XXX-XXXXXX
- **Hours**: 24/7 for critical issues

### Documentation
- **API Docs**: https://docs.bacchecker.gov.gh
- **User Guides**: https://help.bacchecker.gov.gh
- **Video Tutorials**: https://learn.bacchecker.gov.gh

### Community
- **Developer Forum**: https://forum.bacchecker.gov.gh
- **GitHub Issues**: https://github.com/bacchecker/issues
- **Slack Channel**: #bacchecker-developers