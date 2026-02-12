# Documentation Index

## Welcome

This is the AI Customer Support Intelligence Platform - a proof-of-concept that demonstrates how AI can enhance customer support operations through automated message analysis, sentiment detection, and response generation.

## Documentation Structure

### Getting Started

1. **[QUICKSTART.md](QUICKSTART.md)** - Quick start guide and comprehensive reference
   - Setup instructions
   - Feature overview
   - Project structure
   - API endpoints
   - Common workflows
   - Troubleshooting

2. **[README.md](README.md)** - Complete project documentation
   - Full feature list
   - Detailed tech stack
   - Setup instructions
   - API endpoints
   - Customization guide

### Specific Topics

3. **[AUTH_GUIDE.md](AUTH_GUIDE.md)** - Authentication system
   - User roles and permissions
   - Login process
   - Demo accounts
   - Security features
   - Troubleshooting auth issues

4. **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment
   - Railway.app deployment (recommended)
   - Render.com deployment
   - Docker deployment
   - Vercel frontend deployment
   - Environment variables
   - Database setup
   - Monitoring and scaling

### Developer Reference

4. **[DELIVERABLES.md](DELIVERABLES.md)** - Project deliverables checklist
   - Implementation status
   - File structure
   - Component breakdown

## Quick Navigation

### I want to...

**...run the app locally for the first time**

- Start with [QUICKSTART.md](QUICKSTART.md) for setup instructions
- Then check [README.md](README.md) for detailed features

**...understand the authentication system**

- Read [AUTH_GUIDE.md](AUTH_GUIDE.md)

**...deploy to production**

- Follow [DEPLOYMENT.md](DEPLOYMENT.md)

**...quickly reference API endpoints**

- Check [QUICKSTART.md](QUICKSTART.md)
- Or visit http://localhost:8000/docs when backend is running

**...understand the project structure**

- See [README.md](README.md) - Project Structure section
- Or [DELIVERABLES.md](DELIVERABLES.md) for implementation details

**...troubleshoot issues**

- Check the Troubleshooting section in [QUICKSTART.md](QUICKSTART.md)
- Or [AUTH_GUIDE.md](AUTH_GUIDE.md) for auth-specific issues
- Or [DEPLOYMENT.md](DEPLOYMENT.md) for deployment issues

## Key URLs

When running locally:

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs
- **API Alternative Docs:** http://localhost:8000/redoc

## Demo Accounts

Three pre-configured accounts for testing:

| Role     | Email                | Password    |
| -------- | -------------------- | ----------- |
| Agent    | agent@example.com    | password123 |
| Customer | customer@example.com | customer123 |
| Admin    | admin@example.com    | admin123    |

## Tech Stack Summary

**Backend:**

- FastAPI (Python web framework)
- SQLAlchemy (ORM)
- SQLite/PostgreSQL (Database)
- JWT + bcrypt (Authentication)

**Frontend:**

- Next.js 16 (React framework)
- TypeScript
- Tailwind CSS v4
- Shadcn/UI (Component library)
- Lucide React (Icons)
- Recharts (Analytics)

## File Organization

```
gdgoc-cust-support/
├── QUICKSTART.md         # Quick start & comprehensive reference
├── README.md             # Full documentation
├── AUTH_GUIDE.md         # Authentication guide
├── DEPLOYMENT.md         # Deployment instructions
├── DELIVERABLES.md       # Implementation checklist
├── DOCS.md               # This file
├── cs-backend/           # FastAPI backend
│   ├── main.py
│   ├── models.py
│   ├── auth.py
│   ├── database.py
│   ├── ai_service.py
│   └── create_demo_users.py
└── cs-frontend/          # Next.js frontend
    ├── app/
    ├── components/
    └── lib/
```

## Getting Help

1. Check the relevant documentation file above
2. Search for your issue in the Troubleshooting sections
3. Review the API documentation at http://localhost:8000/docs
4. Check the browser console for frontend errors
5. Check the terminal for backend errors
6. Open an issue in the repository

## Next Steps

1. Follow [QUICKSTART.md](QUICKSTART.md) to run the application
2. Login with a demo account
3. Load demo data (Agent/Admin only)
4. Explore the Inbox and Dashboard features
5. Review [DEPLOYMENT.md](DEPLOYMENT.md) when ready for production

---

**Need help choosing where to start?**

- **New to the project?** → [QUICKSTART.md](QUICKSTART.md)
- **Need detailed info?** → [README.md](README.md)
- **Deploying?** → [DEPLOYMENT.md](DEPLOYMENT.md)
