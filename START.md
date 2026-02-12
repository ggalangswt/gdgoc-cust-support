# 🚀 Quick Start Guide

## Running the Application Locally

### Step 1: Start the Backend

Open a terminal in the project root:

```powershell
# Navigate to backend
cd cs-backend

# Create virtual environment (first time only)
python -m venv venv

# Activate virtual environment
.\venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux

# Install dependencies (first time only)
pip install -r requirements.txt

# Run the backend server
python main.py
```

✅ Backend will run on **http://localhost:8000**

---

### Step 2: Start the Frontend

Open a **NEW terminal** in the project root:

```powershell
# Navigate to frontend
cd cs-frontend

# Install dependencies (first time only)
pnpm install

# Run the development server
pnpm dev
```

✅ Frontend will run on **http://localhost:3000**

---

## 🔐 Demo Accounts

After starting both servers, visit **http://localhost:3000/login**

### Available Accounts:

| Role         | Email                | Password    |
| ------------ | -------------------- | ----------- |
| **Agent**    | agent@example.com    | password123 |
| **Customer** | customer@example.com | customer123 |
| **Admin**    | admin@example.com    | admin123    |

---

## 📊 Loading Demo Data

1. Login as an **Agent** or **Admin**
2. Click the **"Load Demo Data"** button in the header
3. This will create:
   - 3 demo users (if not exist)
   - 15 sample customer messages
   - AI analysis for each message

---

## 🔍 What You'll See

### For Agents/Admins:

- **Inbox Tab**: View all customer messages with AI analysis
  - Message list with sentiment badges
  - Full message details
  - AI-generated summaries
  - Suggested responses
  - Status management
- **Dashboard Tab**: Analytics and insights
  - Message statistics
  - Sentiment distribution chart
  - Category breakdown
  - Key insights

### For Customers:

- View their own submitted messages
- See AI-analyzed responses
- Limited dashboard access

---

## 🛠️ Troubleshooting

### Backend Issues

**Port 8000 already in use:**

```powershell
# Find and kill the process
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

**Virtual environment not activating:**

```powershell
# Make sure you're in cs-backend directory
cd cs-backend
.\venv\Scripts\activate
```

### Frontend Issues

**Port 3000 already in use:**

```powershell
# Kill the process or use a different port
pnpm dev -- -p 3001
```

**Dependencies not installing:**

```powershell
# Clear and reinstall
rm -rf node_modules
pnpm install
```

---

## 📁 Project Structure

```
gdgoc-cust-support/
├── cs-backend/          # FastAPI Backend
│   ├── main.py          # API server
│   ├── models.py        # Data models
│   ├── auth.py          # Authentication
│   └── ai_service.py    # AI analysis
│
└── cs-frontend/         # Next.js Frontend
    ├── app/             # Pages
    │   ├── page.tsx     # Main app (protected)
    │   └── login/       # Login page
    ├── components/      # UI components
    └── lib/             # Utilities
        ├── api.ts       # API client
        └── auth-context.tsx  # Auth state
```

---

## 🎯 Key Features

✅ **User Authentication** (JWT tokens)
✅ **Role-Based Access** (Customer, Agent, Admin)
✅ **AI Message Analysis** (Classification, Sentiment, Summarization)
✅ **Real-time Dashboard** (Charts & Analytics)
✅ **Status Management** (Message workflow)
✅ **15 Mock Messages** (Diverse scenarios)

---

## 📚 API Documentation

Once the backend is running, visit:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## 💡 Tips

- **Always login as Agent** to access full features
- **Load demo data first** to see the platform in action
- **Check browser console** for any errors
- **Use demo accounts** - they're pre-configured

---

**Ready to go! 🎉**

Visit http://localhost:3000/login and start exploring!
