# Authentication Guide

## Overview

This guide covers the authentication system implemented in the AI Customer Support Intelligence Platform, including user roles, login process, and security features.

## Features

### User Authentication System

- **Login/Logout** functionality with JWT (JSON Web Tokens)
- **Password Security** using bcrypt hashing
- **Role-based access control** with three user types:
  - **Agents:** Full access to all messages and dashboard
  - **Admins:** Full access plus administrative features
  - **Customers:** View their own messages only (coming soon feature)
- **Protected routes** - authentication required to access the platform

### Demo Accounts

Three pre-configured user accounts for testing:

| Role         | Email                  | Password      | Access Level                    |
| ------------ | ---------------------- | ------------- | ------------------------------- |
| **Agent**    | `agent@example.com`    | `password123` | Full access + demo data loading |
| **Customer** | `customer@example.com` | `customer123` | Limited access                  |
| **Admin**    | `admin@example.com`    | `admin123`    | Full access + admin features    |

### Demo Data (15 Messages)

Diverse customer support scenarios covering:

- Billing issues (negative sentiment)
- Feature requests (positive sentiment)
- Account problems (urgent)
- Technical bugs (very negative)
- Thank you messages (positive)
- Performance issues
- Security concerns
- And more

---

## Running the Application

### 1. Start Backend (Terminal 1)

```powershell
cd cs-backend

# Create virtual environment (first time only)
python -m venv venv

# Activate
.\venv\Scripts\Activate.ps1

# Install dependencies (first time only)
pip install fastapi uvicorn sqlalchemy pydantic python-dotenv python-jose passlib bcrypt python-multipart

# Run server
python main.py
```

**Backend ready at:** http://localhost:8000

**API Documentation:** http://localhost:8000/docs

---

### Start Frontend (Terminal 2)

```powershell
cd cs-frontend

# Install dependencies (first time only)
pnpm install

# Run dev server
pnpm dev
```

**Frontend ready at:** http://localhost:3000

---

## Using the Platform

### Step 1: Login

1. Go to http://localhost:3000
2. You'll be redirected to the login page
3. Click any demo account button to auto-fill credentials
4. Click "Sign In"

### Step 2: Load Demo Data (Agent/Admin only)

1. After login, click the **"Load Demo Data"** button in the header
2. This creates:
   - 3 user accounts (if they don't exist)
   - 15 customer support messages
   - AI analysis for each message

### Step 3: Explore Features

**Inbox Tab:**

- Browse 15 diverse customer messages
- Click messages to see:
  - Full message content
  - AI-generated summary
  - Sentiment analysis (with confidence score)
  - Issue category classification
  - Suggested response draft
- Update message status (New → In Progress → Resolved → Closed)

**Dashboard Tab:**

- Overview metrics (Total, New, In Progress, Resolved)
- Sentiment distribution pie chart
- Category breakdown bar chart
- Key insights and recommendations

---

## Features Showcase

### Login Page

- Clean, professional design
- Demo account quick-fill buttons
- Validation and error handling

### Main Application

- **Protected routes** - login required
- **User display** in header with role badge
- **Logout button** for easy sign out
- **Role-based UI** - agents see "Load Demo Data", customers don't

### Message Analysis

All 15 demo messages are automatically analyzed:

- Categorized (Billing, Technical, Feature, Account, General)
- Sentiment detected (Positive, Neutral, Negative, Very Negative)
- Summarized for quick reading
- Response suggestions provided

---

## Demo Data Details

### Message Categories Breakdown:

- **Billing** (3 messages): Double charge, cancellation, discount code
- **Technical** (4 messages): App crash, performance, mobile sync, API docs
- **Feature Requests** (2 messages): Dark mode, PDF export
- **Account** (2 messages): Login issues, security concerns
- **General** (4 messages): Thank you, team plan inquiry, various

### Sentiment Distribution:

- **Positive** (3): Thank you messages, positive feedback
- **Neutral** (5): Feature requests, general inquiries
- **Negative** (5): Billing issues, technical problems
- **Very Negative** (2): Data loss, urgent critical issues

---

## API Endpoints

New authentication endpoints:

- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/register` - Register new customer
- `GET /api/auth/me` - Get current user info

All message endpoints now support authentication headers.

**API Docs:** http://localhost:8000/docs

---

## Technical Implementation

### Backend:

- JWT token authentication (python-jose)
- Password hashing (bcrypt)
- User model with roles
- Protected endpoints
- 15 pre-made mock messages

### Frontend:

- Auth context (React Context API)
- Protected routes with redirect
- Token storage (localStorage)
- Login page with demo accounts
- Role-based UI rendering

---

## Key Improvements

1. **Security**: JWT tokens, password hashing, protected routes
2. **UX**: Easy login with demo accounts, auto-fill buttons
3. **Rich Data**: 15 diverse messages covering real scenarios
4. **Role-Based**: Different experience for agents vs customers
5. **Production-Ready**: Clean auth flow, proper error handling

---

## Demo Scenarios

1. **Login as Agent** → Load demo data → Browse all messages
2. **Check Dashboard** → See analytics and insights
3. **Click a message** → Review AI analysis → Update status
4. **Logout** → Try customer account → See limited access
5. **Compare roles** → Notice UI differences

---

## Troubleshooting

### Backend Issues

1. **Backend not starting?**
   - Check virtual environment is activated
   - Verify dependencies are installed with `pip list`
   - Ensure port 8000 is available

2. **Database errors?**
   - Check `customer_support.db` file exists
   - Run `python create_demo_users.py` to seed users
   - Delete database file and restart to recreate

### Frontend Issues

1. **Frontend not connecting?**
   - Verify backend is running on port 8000
   - Check browser console for errors
   - Clear localStorage if experiencing auth issues

2. **Can't login?**
   - Use exact credentials from demo accounts table
   - Check backend terminal for error messages
   - Ensure demo users were created (run `create_demo_users.py`)

### Common Solutions

**Clear application state:**

```javascript
// In browser console
localStorage.clear();
location.reload();
```

**Restart backend:**

```powershell
# Stop current process (Ctrl+C)
cd cs-backend
.\venv\Scripts\activate
python main.py
```

**Verify demo users exist:**

```powershell
cd cs-backend
python check_users.py
```

---

## Next Steps

After getting familiar with the authentication system:

1. Review the [Deployment Guide](DEPLOYMENT.md) for production setup
2. Check [README.md](README.md) for full feature documentation
3. Explore [QUICKSTART.md](QUICKSTART.md) for quick reference

---

**Now you're ready to explore the AI Customer Support platform!**

Visit http://localhost:3000 and login with any demo account to start.
