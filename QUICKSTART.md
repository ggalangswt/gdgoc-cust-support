# Quick Start Guide

## Project Summary

**Purpose**: AI-powered customer support platform that automatically analyzes, classifies, and responds to customer inquiries.

**Tech Stack**:

- Backend: FastAPI + Python + SQLite/PostgreSQL
- Frontend: Next.js 16 + TypeScript + Tailwind CSS + Shadcn/UI
- AI: Mock service (or optional OpenAI API)

---

## Quick Start

### Backend Setup

```powershell
cd cs-backend

# Create virtual environment (first time only)
python -m venv venv

# Activate virtual environment
.\venv\Scripts\activate  # Windows
source venv/bin/activate # Mac/Linux

# Install dependencies (first time only)
pip install -r requirements.txt

# Run backend server
python main.py
```

**Backend URL:** http://localhost:8000

### Frontend Setup

Open a new terminal:

```powershell
cd cs-frontend

# Install dependencies (first time only)
pnpm install

# Run development server
pnpm dev
```

**Frontend URL:** http://localhost:3000

---

## Features Overview

### Inbox View

```
┌─────────────────┬──────────────────────┬────────────────┐
│  Message List   │   Message Detail     │  AI Analysis   │
│                 │                      │                │
│ • Messages      │ • Subject            │ • Category     │
│ • Categories    │ • Customer Info      │ • Sentiment    │
│ • Sentiment     │ • AI Summary         │ • Score        │
│ • Status        │ • Original Message   │ • Insights     │
│                 │ • Suggested Reply    │ • Actions      │
└─────────────────┴──────────────────────┴────────────────┘
```

### Dashboard View

- **Metrics:** Total, New, In Progress, Resolved
- **Sentiment Chart:** Pie chart of customer sentiment distribution
- **Category Chart:** Bar chart of issue categories
- **Key Insights:** Actionable recommendations

---

## AI Features

| Feature            | Description                 | Example                                        |
| ------------------ | --------------------------- | ---------------------------------------------- |
| **Classification** | Auto-categorizes issues     | Billing, Technical, Feature, Account, General  |
| **Sentiment**      | Detects emotional tone      | Positive, Neutral, Negative, Very Negative     |
| **Summarization**  | Condenses long messages     | "Customer requesting refund for double charge" |
| **Response Gen**   | Drafts professional replies | Pre-written empathetic responses               |

---

## Project Structure

```
gdgoc-cust-support/
├── cs-backend/
│   ├── main.py              # API endpoints
│   ├── models.py            # Data models
│   ├── ai_service.py        # AI logic
│   └── database.py          # DB config
│
├── cs-frontend/
│   ├── app/
│   │   └── page.tsx         # Main app
│   ├── components/
│   │   ├── inbox/           # Inbox UI
│   │   ├── dashboard/       # Analytics UI
│   │   └── ui/              # Shadcn components
│   └── lib/
│       └── api.ts           # API client
│
└── README.md                # Full documentation
```

---

## API Endpoints

| Method  | Endpoint                   | Purpose                  |
| ------- | -------------------------- | ------------------------ |
| `GET`   | `/api/messages`            | List all messages        |
| `POST`  | `/api/messages`            | Create & analyze message |
| `PATCH` | `/api/messages/{id}`       | Update status            |
| `GET`   | `/api/analytics/dashboard` | Get statistics           |
| `POST`  | `/api/seed-demo-data`      | Load demo data           |

**Full API Docs:** http://localhost:8000/docs

---

## UI Components

### Built Components

- Message List (with filtering)
- Message Detail View
- AI Analysis Panel
- Sentiment Badges
- Category Labels
- Analytics Dashboard
- Charts (Pie, Bar)
- Status Management

### UI Libraries Used

- Shadcn/UI (Cards, Buttons, Tabs, Badges)
- Lucide React (Icons)
- Recharts (Charts)
- Tailwind CSS (Styling)

---

## Usage Flow

1. **Load Demo Data**: Click button in UI
2. **Browse Messages**: View inbox with AI analysis
3. **Review Analysis**: See sentiment, category, summary
4. **Read Suggested Response**: AI-generated draft
5. **Update Status**: Move to In Progress → Resolved → Closed
6. **View Dashboard:** Analyze trends and insights

---

## Customization

### Backend

- **AI Logic**: `cs-backend/ai_service.py`
- **Database**: Change `DATABASE_URL` in `.env`
- **API Routes**: `cs-backend/main.py`

### Frontend

- **Styling**: `cs-frontend/app/globals.css`
- **Components**: `cs-frontend/components/`
- **API Client:** `cs-frontend/lib/api.ts`

---

## Demo Scenarios

### Loaded Demo Messages:

1. **Billing Issue** (Negative) - Double charge complaint
2. **Feature Request** (Positive) - Dark mode suggestion
3. **Account Problem** (Negative) - Login issues
4. **Technical Bug** (Very Negative) - App crashing
5. **Thank You** (Positive) - Appreciation message

Each message is automatically:

- Classified by category
- Analyzed for sentiment
- Summarized
- Given a suggested response

---

## Troubleshooting

### Backend not starting?

```powershell
# Check if port 8000 is in use
netstat -ano | findstr :8000

# Activate virtual environment
cd cs-backend
.\venv\Scripts\activate
```

### Frontend not connecting?

```bash
# Check .env.local
cat cs-frontend/.env.local

# Should be: NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Dependencies missing?

```bash
# Backend
cd cs-backend
pip install -r requirements.txt

# Frontend
cd cs-frontend
pnpm install
```

---

## Next Steps

- [ ] Add real OpenAI integration
- [ ] Implement user authentication
- [ ] Add email integration (IMAP/SMTP)
- [ ] Real-time updates (WebSockets)
- [ ] Multi-agent assignment
- [ ] Conversation threading
- [ ] Export reports (PDF/CSV)
- [ ] Advanced filtering & search
- [ ] Mobile responsive improvements

---

## Additional Resources

- **Full Documentation:** [README.md](README.md)
- **Authentication Guide:** [AUTH_GUIDE.md](AUTH_GUIDE.md)
- **Deployment Guide:** [DEPLOYMENT.md](DEPLOYMENT.md)
- **API Docs:** http://localhost:8000/docs
- **FastAPI Documentation:** https://fastapi.tiangolo.com/
- **Next.js Documentation:** https://nextjs.org/docs
- **Shadcn/UI Components:** https://ui.shadcn.com/

---

**Built for GDGOC - February 2026**
