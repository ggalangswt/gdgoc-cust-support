# Deployment Guide

## Overview

This guide covers deploying the AI Customer Support Intelligence Platform to production. The recommended setup is:

- **Backend (FastAPI):** Railway.app or Render.com
- **Frontend (Next.js):** Vercel

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Backend Deployment](#backend-deployment)
3. [Frontend Deployment](#frontend-deployment)
4. [Environment Variables](#environment-variables)
5. [Database Configuration](#database-configuration)
6. [Post-Deployment Setup](#post-deployment-setup)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deployment, ensure you have:

- Git repository with your code
- GitHub account (for Railway/Vercel integration)
- Railway.app or Render.com account (for backend)
- Vercel account (for frontend)
- Production-ready environment variables

### Prepare Your Code

```bash
# Ensure all changes are committed
git add .
git commit -m "Prepare for deployment"
git push origin main
```

---

## Backend Deployment

### Option 1: Railway.app (Recommended)

Railway.app provides the easiest deployment experience for Python applications with built-in PostgreSQL support.

#### Step 1: Setup Railway

1. Visit [railway.app](https://railway.app/)
2. Sign up with GitHub
3. Install Railway CLI (optional):
   ```bash
   npm install -g @railway/cli
   ```

#### Step 2: Create Backend Service

**Via Web Dashboard:**

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your repository
4. Railway will auto-detect Python project
5. Set **Root Directory** to `cs-backend` if needed

**Via CLI:**

```bash
cd cs-backend
railway login
railway init
railway up
```

#### Step 3: Configure Environment Variables

In Railway dashboard, add these variables:

```env
SECRET_KEY=your-super-secret-jwt-key-change-this-in-production
DATABASE_URL=postgresql://user:pass@host:port/dbname
OPENAI_API_KEY=sk-your-openai-key-optional
ENVIRONMENT=production
```

**To generate a secure SECRET_KEY:**

```python
import secrets
print(secrets.token_urlsafe(32))
```

#### Step 4: Add PostgreSQL Database

1. In Railway project, click **"New"** → **"Database"** → **"PostgreSQL"**
2. Railway will automatically set `DATABASE_URL` variable
3. No manual configuration needed

#### Step 5: Configure Build

Create `railway.json` in `cs-backend/`:

```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "uvicorn main:app --host 0.0.0.0 --port $PORT",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

#### Step 6: Generate Domain

1. Go to **Settings** → **Environment**
2. Click **"Generate Domain"**
3. Copy the URL (e.g., `https://cs-backend-production.up.railway.app`)

#### Step 7: Update Database Configuration

Update `cs-backend/database.py` to support PostgreSQL:

```python
import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL")

# Fix for Railway PostgreSQL URL
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
```

#### Step 8: Seed Production Data

After deployment, seed demo users:

```bash
# SSH into Railway container or use local script
railway run python create_demo_users.py
```

---

### Option 2: Render.com

Render provides similar ease of deployment with a generous free tier.

#### Step 1: Setup Render

1. Visit [render.com](https://render.com/)
2. Sign up with GitHub
3. Click **"New +"** → **"Web Service"**

#### Step 2: Configure Service

- **Repository:** Select your GitHub repo
- **Root Directory:** `cs-backend`
- **Environment:** Python 3
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`

#### Step 3: Add PostgreSQL

1. In Render dashboard, click **"New +"** → **"PostgreSQL"**
2. Create database
3. Copy the **Internal Database URL**

#### Step 4: Environment Variables

Add in Render dashboard:

```env
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://...from-render-postgres
OPENAI_API_KEY=sk-your-key-optional
ENVIRONMENT=production
```

#### Step 5: Deploy

1. Click **"Create Web Service"**
2. Render will build and deploy automatically
3. Copy the service URL

---

### Option 3: Docker Deployment

For AWS, GCP, Azure, or self-hosted environments.

#### Step 1: Create Dockerfile

Create `cs-backend/Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Run application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### Step 2: Build and Test Locally

```bash
cd cs-backend
docker build -t cs-backend .
docker run -p 8000:8000 -e DATABASE_URL=sqlite:///./test.db cs-backend
```

#### Step 3: Deploy to Cloud

**AWS ECS/Fargate:**

```bash
aws ecr create-repository --repository-name cs-backend
docker tag cs-backend:latest <aws-account-id>.dkr.ecr.<region>.amazonaws.com/cs-backend:latest
docker push <aws-account-id>.dkr.ecr.<region>.amazonaws.com/cs-backend:latest
```

**Google Cloud Run:**

```bash
gcloud builds submit --tag gcr.io/PROJECT-ID/cs-backend
gcloud run deploy cs-backend --image gcr.io/PROJECT-ID/cs-backend --platform managed
```

**Azure Container Instances:**

```bash
az acr build --registry <registry-name> --image cs-backend:latest .
az container create --resource-group myResourceGroup --name cs-backend --image <registry-name>.azurecr.io/cs-backend:latest
```

---

## Frontend Deployment

### Vercel (Recommended)

Vercel is optimal for Next.js applications with zero configuration.

#### Step 1: Setup Vercel

1. Visit [vercel.com](https://vercel.com/)
2. Sign up with GitHub
3. Click **"Add New..."** → **"Project"**

#### Step 2: Import Repository

1. Select your GitHub repository
2. Vercel auto-detects Next.js
3. Set **Root Directory** to `cs-frontend`

#### Step 3: Configure Environment Variables

Add in Vercel dashboard:

```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
NEXT_PUBLIC_USE_MOCK_API=false
```

**For Mock API Mode (no backend needed):**

```env
NEXT_PUBLIC_USE_MOCK_API=true
```

#### Step 4: Deploy

1. Click **"Deploy"**
2. Vercel builds and deploys automatically
3. Get production URL (e.g., `https://cs-frontend.vercel.app`)

#### Step 5: Configure Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Update DNS records as instructed

---

### Alternative: Netlify

Similar to Vercel, optimized for static sites and Next.js.

#### Deployment Steps:

1. Visit [netlify.com](https://netlify.com/)
2. **"Add new site"** → **"Import from Git"**
3. Select repository
4. **Build command:** `cd cs-frontend && npm run build`
5. **Publish directory:** `cs-frontend/.next`
6. Add environment variables
7. Deploy

---

## Environment Variables

### Backend Environment Variables

| Variable          | Description                  | Example                               | Required |
| ----------------- | ---------------------------- | ------------------------------------- | -------- |
| `DATABASE_URL`    | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` | Yes      |
| `SECRET_KEY`      | JWT token secret             | `random-32-char-string`               | Yes      |
| `OPENAI_API_KEY`  | OpenAI API key               | `sk-...`                              | No       |
| `ENVIRONMENT`     | Deployment environment       | `production`                          | No       |
| `ALLOWED_ORIGINS` | CORS allowed origins         | `https://frontend.vercel.app`         | No       |

### Frontend Environment Variables

| Variable                   | Description     | Example                       | Required |
| -------------------------- | --------------- | ----------------------------- | -------- |
| `NEXT_PUBLIC_API_URL`      | Backend API URL | `https://backend.railway.app` | Yes      |
| `NEXT_PUBLIC_USE_MOCK_API` | Use mock data   | `false`                       | No       |

---

## Database Configuration

### Production Database Setup

#### Using Railway PostgreSQL:

1. Database is automatically provisioned
2. Connection string auto-configured
3. No manual setup required

#### Using External PostgreSQL:

Update `cs-backend/database.py`:

```python
import os
from sqlalchemy import create_engine, pool

DATABASE_URL = os.getenv("DATABASE_URL")

# Configure connection pooling for production
engine = create_engine(
    DATABASE_URL,
    poolclass=pool.QueuePool,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,
    echo=False
)
```

### Database Migrations

For schema changes, use Alembic:

```bash
# Install Alembic
pip install alembic

# Initialize
alembic init alembic

# Create migration
alembic revision --autogenerate -m "Initial schema"

# Apply migration
alembic upgrade head
```

---

## Post-Deployment Setup

### 1. Test Backend Health

```bash
curl https://your-backend-url.railway.app/health
```

Expected response:

```json
{ "status": "healthy" }
```

### 2. Create Admin User

Run the seed script:

```bash
# Via Railway CLI
railway run python create_demo_users.py

# Via direct database connection
psql $DATABASE_URL -c "your-sql-query"
```

### 3. Test API Endpoints

```bash
# Test login
curl -X POST https://your-backend-url.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"agent@example.com","password":"password123"}'

# Test messages endpoint
curl https://your-backend-url.railway.app/api/messages
```

### 4. Verify Frontend

1. Visit your Vercel URL
2. Test login with demo accounts
3. Load demo data
4. Verify all features work

### 5. Configure CORS

Update `cs-backend/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-frontend.vercel.app",
        "https://www.yourdomain.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Monitoring and Logging

### Railway Logs

```bash
# Via CLI
railway logs

# Or view in web dashboard
```

### Application Monitoring

Add health check endpoint monitoring:

```python
# In main.py
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "database": check_database_connection(),
        "timestamp": datetime.utcnow()
    }
```

### Error Tracking

Consider integrating:

- **Sentry** for error tracking
- **LogRocket** for session replay
- **Datadog** for APM

---

## Performance Optimization

### Backend Optimization

1. **Enable response caching:**

   ```python
   from fastapi_cache import FastAPICache
   from fastapi_cache.backends.redis import RedisBackend

   @app.on_event("startup")
   async def startup():
       FastAPICache.init(RedisBackend(), prefix="fastapi-cache")
   ```

2. **Use connection pooling** (already configured in Railway)

3. **Add database indexes:**
   ```python
   class MessageDB(Base):
       __tablename__ = "messages"

       id = Column(Integer, primary_key=True, index=True)
       status = Column(String, index=True)
       category = Column(String, index=True)
       created_at = Column(DateTime, index=True)
   ```

### Frontend Optimization

1. **Enable caching in `next.config.ts`:**

   ```typescript
   const nextConfig = {
     images: {
       domains: ["your-backend.railway.app"],
     },
     compiler: {
       removeConsole: process.env.NODE_ENV === "production",
     },
   };
   ```

2. **Use ISR for static content:**
   ```typescript
   export const revalidate = 60; // Revalidate every 60 seconds
   ```

---

## Security Checklist

- [ ] Change default SECRET_KEY
- [ ] Use HTTPS for all endpoints
- [ ] Enable rate limiting
- [ ] Sanitize user inputs
- [ ] Use prepared statements (SQLAlchemy does this)
- [ ] Enable CORS only for known origins
- [ ] Store secrets in environment variables
- [ ] Enable database connection encryption
- [ ] Implement request validation
- [ ] Add authentication to all protected endpoints
- [ ] Set secure cookie flags
- [ ] Enable CSRF protection

### Rate Limiting

Add to `cs-backend/main.py`:

```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.post("/api/messages")
@limiter.limit("5/minute")
async def create_message(message: MessageCreate):
    pass
```

---

## Troubleshooting

### Common Issues

#### Backend not starting

**Check logs:**

```bash
railway logs
```

**Common causes:**

- Missing environment variables
- Database connection failed
- Port binding issues
- Dependency errors

**Solution:**

- Verify all environment variables are set
- Test database connection
- Check Railway/Render logs
- Rebuild with fresh dependencies

#### Frontend API connection errors

**Check:**

1. Backend URL is correct in `NEXT_PUBLIC_API_URL`
2. Backend is running and accessible
3. CORS is properly configured
4. Network/firewall not blocking requests

**Debug:**

```javascript
// Add to api.ts
console.log("API Base URL:", this.baseUrl);
```

#### Database connection failed

**Railway PostgreSQL:**

- Check database is provisioned
- Verify DATABASE_URL is set
- Check connection limits

**Solutions:**

```bash
# Test connection
railway run python -c "from database import engine; engine.connect()"

# Restart database
# Via Railway dashboard: Database → Settings → Restart
```

#### CORS errors

**Symptom:**

```
Access to fetch at 'https://backend.railway.app' from origin 'https://frontend.vercel.app'
has been blocked by CORS policy
```

**Solution:**
Update `main.py`:

```python
allow_origins=[
    "https://your-frontend.vercel.app",
    "https://*.vercel.app",  # Allow all Vercel preview deployments
]
```

---

## Rollback Procedure

### Railway/Render

1. Go to deployment history
2. Select previous working deployment
3. Click "Redeploy"

### Vercel

1. Go to "Deployments" tab
2. Find working deployment
3. Click three dots → "Promote to Production"

### Manual Rollback

```bash
# Git rollback
git revert <commit-hash>
git push origin main

# Deployments auto-trigger
```

---

## Scaling Considerations

### Backend Scaling

**Horizontal Scaling:**

- Railway/Render auto-scale based on traffic
- Add more instances in dashboard

**Database Scaling:**

- Upgrade PostgreSQL plan
- Add read replicas
- Implement caching (Redis)

**Async Processing:**

```python
from fastapi import BackgroundTasks

@app.post("/api/messages")
async def create_message(message: MessageCreate, background_tasks: BackgroundTasks):
    background_tasks.add_task(analyze_message, message)
```

### Frontend Scaling

Vercel handles this automatically:

- CDN distribution
- Edge caching
- Serverless functions

---

## Backup and Recovery

### Database Backup

**Railway:**

```bash
# Automated daily backups included
# Manual backup:
railway db backup
```

**Manual PostgreSQL backup:**

```bash
pg_dump $DATABASE_URL > backup.sql
```

### Restore from Backup

```bash
psql $DATABASE_URL < backup.sql
```

---

## Cost Estimation

### Railway.app (Recommended)

- **Starter Plan:** $5/month credit (free tier)
- **Developer Plan:** $20/month for production use
- Includes PostgreSQL database
- Auto-scaling included

### Render.com

- **Free Tier:** Available (with limitations)
- **Starter:** $7/month per service
- PostgreSQL: $7/month

### Vercel (Frontend)

- **Hobby:** Free for personal projects
- **Pro:** $20/month for commercial use
- Unlimited deployments
- Global CDN included

**Total Estimated Cost:**

- Development: $0 (free tiers)
- Production: $25-50/month (Railway + Vercel Pro)

---

## Next Steps

After successful deployment:

1. Set up monitoring and alerts
2. Configure custom domain
3. Enable SSL certificates (auto with Railway/Vercel)
4. Set up CI/CD pipeline
5. Implement database backups
6. Add logging and error tracking
7. Performance testing
8. Security audit

---

## Support Resources

- **Railway Documentation:** https://docs.railway.app/
- **Render Documentation:** https://render.com/docs
- **Vercel Documentation:** https://vercel.com/docs
- **FastAPI Deployment:** https://fastapi.tiangolo.com/deployment/
- **Next.js Deployment:** https://nextjs.org/docs/deployment

For project-specific issues, check the main [README.md](README.md) or open an issue in the repository.
