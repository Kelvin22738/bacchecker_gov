# BacChecker Deployment Guide

## Deployment Overview

This guide covers deploying BacChecker Government Suite™ to production environments, including cloud platforms, on-premises servers, and hybrid configurations.

## Deployment Options

### 1. Netlify (Recommended for Frontend)
**Best for**: Static site hosting with global CDN

#### Automatic Deployment
```bash
# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

#### Manual Deployment
1. **Build Application**:
   ```bash
   npm run build
   ```

2. **Deploy via Netlify Dashboard**:
   - Drag and drop `dist` folder
   - Configure custom domain
   - Set environment variables

#### Netlify Configuration
```toml
# netlify.toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "20"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
```

### 2. Vercel
**Best for**: React applications with serverless functions

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### 3. AWS (Enterprise)
**Best for**: Large-scale government deployments

#### S3 + CloudFront
```bash
# Build application
npm run build

# Upload to S3
aws s3 sync dist/ s3://bacchecker-frontend

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

### 4. On-Premises Deployment
**Best for**: Government security requirements

#### Using Docker
```dockerfile
# Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
# Build and run
docker build -t bacchecker .
docker run -p 80:80 bacchecker
```

## Environment Configuration

### Production Environment Variables
```env
# Application
VITE_APP_ENV=production
VITE_APP_NAME=BacChecker Government Suite
VITE_APP_VERSION=2.0.0

# Supabase (Production)
VITE_SUPABASE_URL=https://your-prod-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key

# API Configuration
VITE_API_BASE_URL=https://api.bacchecker.gov.gh/v1
VITE_API_TIMEOUT=30000

# Security
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_REPORTING=true

# External Services
VITE_PAYSTACK_PUBLIC_KEY=pk_live_your-live-key
VITE_STRIPE_PUBLIC_KEY=pk_live_your-live-key
```

### Staging Environment Variables
```env
# Application
VITE_APP_ENV=staging
VITE_APP_NAME=BacChecker Government Suite (Staging)

# Supabase (Staging)
VITE_SUPABASE_URL=https://your-staging-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-staging-anon-key

# External Services (Test Keys)
VITE_PAYSTACK_PUBLIC_KEY=pk_test_your-test-key
VITE_STRIPE_PUBLIC_KEY=pk_test_your-test-key
```

## Database Deployment

### Supabase Production Setup

#### 1. Create Production Project
1. **Create Supabase Project**:
   - Go to Supabase Dashboard
   - Create new project for production
   - Choose appropriate region (closest to Ghana)

2. **Configure Database**:
   ```sql
   -- Run migration files in order
   -- File: supabase/migrations/20250719154935_fading_bonus.sql
   -- File: supabase/migrations/20250720084543_silver_queen.sql
   ```

3. **Set Up Row Level Security**:
   ```sql
   -- Enable RLS on all tables
   ALTER TABLE tertiary_institutions ENABLE ROW LEVEL SECURITY;
   ALTER TABLE verification_requests ENABLE ROW LEVEL SECURITY;
   -- ... (other tables)
   ```

#### 2. Configure Authentication
```sql
-- Set up authentication policies
CREATE POLICY "Users can read own data"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);
```

#### 3. Set Up Storage
```sql
-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false);

-- Set up storage policies
CREATE POLICY "Users can upload documents"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'documents');
```

### Database Migration Strategy
1. **Backup Current Data**: Always backup before migrations
2. **Test in Staging**: Run migrations in staging environment first
3. **Schedule Downtime**: Plan maintenance windows for major changes
4. **Rollback Plan**: Prepare rollback procedures

## Security Configuration

### SSL/TLS Setup
```nginx
# nginx.conf
server {
    listen 443 ssl http2;
    server_name bacchecker.gov.gh;
    
    ssl_certificate /etc/ssl/certs/bacchecker.crt;
    ssl_certificate_key /etc/ssl/private/bacchecker.key;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
    
    add_header Strict-Transport-Security "max-age=63072000" always;
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https:;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://*.supabase.co;
">
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
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@headlessui/react', 'lucide-react'],
          forms: ['react-hook-form', '@hookform/resolvers'],
          charts: ['recharts'],
          utils: ['date-fns', 'clsx', 'framer-motion']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false, // Disable in production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
});
```

### CDN Configuration
```javascript
// Configure CDN for static assets
const CDN_URL = 'https://cdn.bacchecker.gov.gh';

// Update asset URLs
const assetUrl = (path) => `${CDN_URL}${path}`;
```

### Caching Strategy
```nginx
# Static assets
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    add_header Vary "Accept-Encoding";
}

# HTML files
location ~* \.html$ {
    expires 1h;
    add_header Cache-Control "public, must-revalidate";
}

# API responses
location /api/ {
    expires 5m;
    add_header Cache-Control "public, max-age=300";
}
```

## Monitoring and Logging

### Application Monitoring
```javascript
// Sentry configuration
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: process.env.VITE_APP_ENV,
  tracesSampleRate: 1.0,
  beforeSend(event) {
    // Filter sensitive data
    if (event.user) {
      delete event.user.email;
    }
    return event;
  }
});
```

### Health Checks
```javascript
// Health check endpoint
export const healthCheck = {
  async check() {
    const checks = {
      database: await checkDatabase(),
      storage: await checkStorage(),
      external_apis: await checkExternalAPIs(),
      memory: process.memoryUsage(),
      uptime: process.uptime()
    };
    
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      checks
    };
  }
};
```

### Log Management
```javascript
// Structured logging
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

## Backup and Recovery

### Automated Backup Strategy
```bash
#!/bin/bash
# backup-script.sh

# Database backup
supabase db dump --file "backup-$(date +%Y%m%d-%H%M%S).sql"

# File backup
tar -czf "files-backup-$(date +%Y%m%d).tar.gz" /var/www/bacchecker/uploads/

# Upload to cloud storage
aws s3 cp backup-*.sql s3://bacchecker-backups/database/
aws s3 cp files-backup-*.tar.gz s3://bacchecker-backups/files/

# Cleanup old backups (keep 30 days)
find /backup -name "backup-*.sql" -mtime +30 -delete
```

### Recovery Procedures
1. **Database Recovery**:
   ```bash
   # Restore database from backup
   supabase db reset --file backup-20240630.sql
   ```

2. **File Recovery**:
   ```bash
   # Restore files from backup
   tar -xzf files-backup-20240630.tar.gz -C /var/www/bacchecker/
   ```

3. **Verification Steps**:
   - Test critical functionality
   - Verify data integrity
   - Check user access
   - Validate integrations

## Scaling Considerations

### Horizontal Scaling
- **Load Balancers**: Distribute traffic across multiple instances
- **Database Replicas**: Read replicas for improved performance
- **CDN**: Global content delivery network
- **Microservices**: Split into smaller, manageable services

### Vertical Scaling
- **CPU Upgrade**: Increase processing power
- **Memory Expansion**: Add more RAM
- **Storage Optimization**: Faster storage solutions
- **Network Bandwidth**: Increase network capacity

### Auto-Scaling Configuration
```yaml
# Kubernetes auto-scaling
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: bacchecker-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: bacchecker-frontend
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

## Maintenance Procedures

### Regular Maintenance
1. **Daily Tasks**:
   - Monitor system health
   - Check error logs
   - Verify backup completion
   - Review security alerts

2. **Weekly Tasks**:
   - Update dependencies
   - Performance analysis
   - Security scan
   - Capacity review

3. **Monthly Tasks**:
   - Full system backup
   - Security audit
   - Performance optimization
   - Disaster recovery test

### Update Deployment
```bash
#!/bin/bash
# update-deployment.sh

# 1. Backup current system
./scripts/backup-system.sh

# 2. Pull latest changes
git pull origin main

# 3. Install dependencies
npm ci

# 4. Run tests
npm run test

# 5. Build application
npm run build

# 6. Deploy to staging
npm run deploy:staging

# 7. Run integration tests
npm run test:integration

# 8. Deploy to production
npm run deploy:production

# 9. Verify deployment
./scripts/health-check.sh
```

## Disaster Recovery

### Recovery Planning
1. **Recovery Time Objective (RTO)**: 4 hours maximum
2. **Recovery Point Objective (RPO)**: 1 hour maximum data loss
3. **Backup Frequency**: Every 6 hours
4. **Geographic Distribution**: Multi-region backups

### Emergency Procedures
1. **System Failure**:
   - Activate backup systems
   - Notify stakeholders
   - Begin recovery procedures
   - Document incident

2. **Data Corruption**:
   - Isolate affected systems
   - Restore from clean backup
   - Verify data integrity
   - Resume operations

3. **Security Breach**:
   - Isolate compromised systems
   - Preserve evidence
   - Notify authorities
   - Implement security patches

## Compliance and Governance

### Government Compliance
- **Data Sovereignty**: Ensure data remains within Ghana
- **Privacy Regulations**: Comply with local privacy laws
- **Audit Requirements**: Maintain comprehensive audit trails
- **Security Standards**: Meet government security requirements

### Documentation Requirements
- **System Architecture**: Detailed technical documentation
- **Security Policies**: Information security procedures
- **Operational Procedures**: Standard operating procedures
- **Disaster Recovery**: Comprehensive recovery plans

## Support and Maintenance

### Support Structure
1. **Level 1 Support**: Basic user assistance
2. **Level 2 Support**: Technical issue resolution
3. **Level 3 Support**: Advanced technical and development support
4. **Emergency Support**: 24/7 critical issue response

### Maintenance Windows
- **Regular Maintenance**: Sundays 2:00 AM - 4:00 AM GMT
- **Emergency Maintenance**: As needed with 2-hour notice
- **Major Updates**: Scheduled monthly with 1-week notice

### Change Management
1. **Change Request**: Formal change request process
2. **Impact Assessment**: Evaluate potential impacts
3. **Testing**: Comprehensive testing in staging
4. **Approval**: Stakeholder approval required
5. **Implementation**: Controlled deployment process
6. **Verification**: Post-deployment verification

## Cost Optimization

### Resource Optimization
- **Right-sizing**: Match resources to actual usage
- **Reserved Instances**: Use reserved instances for predictable workloads
- **Spot Instances**: Use spot instances for non-critical workloads
- **Auto-scaling**: Implement intelligent auto-scaling

### Cost Monitoring
- **Budget Alerts**: Set up cost monitoring and alerts
- **Usage Analytics**: Track resource utilization
- **Cost Allocation**: Allocate costs by department/function
- **Regular Reviews**: Monthly cost optimization reviews

## Quality Assurance

### Testing Strategy
1. **Unit Tests**: Component and function testing
2. **Integration Tests**: API and database testing
3. **End-to-End Tests**: Complete workflow testing
4. **Performance Tests**: Load and stress testing
5. **Security Tests**: Vulnerability and penetration testing

### Deployment Pipeline
```yaml
# GitHub Actions workflow
name: Deploy to Production
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test
      - run: npm run test:e2e

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - name: Deploy to Netlify
        uses: netlify/actions/cli@master
        with:
          args: deploy --prod --dir=dist
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## Troubleshooting Deployment Issues

### Build Failures
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json dist
npm cache clean --force
npm install
npm run build
```

### Environment Variable Issues
```bash
# Verify environment variables
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY

# Check for missing variables
npm run build 2>&1 | grep -i "environment"
```

### Database Connection Issues
```bash
# Test database connection
curl -X GET \
  'https://your-project.supabase.co/rest/v1/tertiary_institutions?select=count' \
  -H 'apikey: your-anon-key'
```

### Performance Issues
1. **Bundle Analysis**:
   ```bash
   npm run build -- --analyze
   ```

2. **Lighthouse Audit**:
   ```bash
   npm install -g lighthouse
   lighthouse https://your-site.com --output html
   ```

## Post-Deployment Checklist

### Immediate Verification
- [ ] Application loads successfully
- [ ] All routes are accessible
- [ ] Authentication works correctly
- [ ] Database connections are stable
- [ ] API endpoints respond correctly
- [ ] File uploads work properly
- [ ] Email notifications are sent
- [ ] Payment processing functions

### Performance Verification
- [ ] Page load times under 3 seconds
- [ ] API response times under 500ms
- [ ] Database queries optimized
- [ ] CDN serving static assets
- [ ] Compression enabled
- [ ] Caching configured correctly

### Security Verification
- [ ] HTTPS enforced everywhere
- [ ] Security headers configured
- [ ] Authentication working
- [ ] Authorization rules enforced
- [ ] Audit logging enabled
- [ ] Error handling secure

### Monitoring Setup
- [ ] Health checks configured
- [ ] Error tracking enabled
- [ ] Performance monitoring active
- [ ] Uptime monitoring configured
- [ ] Alert notifications working
- [ ] Log aggregation setup

## Rollback Procedures

### Quick Rollback
```bash
# Rollback to previous deployment
netlify rollback

# Or restore from backup
git checkout previous-stable-commit
npm run build
netlify deploy --prod --dir=dist
```

### Database Rollback
```bash
# Restore database from backup
supabase db reset --file backup-before-deployment.sql
```

### Verification After Rollback
1. **Test Critical Functions**: Verify core functionality works
2. **Check Data Integrity**: Ensure no data corruption
3. **Monitor Performance**: Watch for any performance issues
4. **Notify Stakeholders**: Inform relevant parties of rollback