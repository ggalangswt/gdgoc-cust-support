# AI Customer Support Intelligence Platform

A modern, AI-powered customer support platform with **user authentication** that automatically analyzes messages to classify issues, detect sentiment, summarize conversations, and suggest responses.

## Overview

This proof-of-concept demonstrates an intelligent customer support system that helps support agents prioritize and respond to customer inquiries more efficiently using AI-powered analysis. The platform includes full authentication and role-based access control.

### Key Features

- **User Authentication**: Secure login with JWT tokens and bcrypt password hashing
- **Role-Based Access Control**: Customer, Agent, and Admin roles with different permissions
- **Automated Message Classification**: Categorizes issues into Billing, Technical, Feature Request, Account, or General
- **Sentiment Analysis**: Detects customer sentiment (Positive, Neutral, Negative, Very Negative) with confidence scores
- **AI Summarization**: Generates concise summaries of customer messages
- **Response Generation**: Provides AI-drafted response suggestions
- **Analytics Dashboard**: Visual insights with charts and metrics
- **Real-time Updates**: Modern, responsive UI with instant feedback
- **Demo Data**: 15 diverse, realistic customer support scenarios for testing

## Project Structure

```
gdgoc-cust-support/
├── cs-backend/                  # FastAPI Backend
│   ├── main.py                  # FastAPI application & API endpoints
│   ├── models.py                # Pydantic & SQLAlchemy models
│   ├── ai_service.py            # AI analysis logic (mock & OpenAI)
│   ├── database.py              # Database configuration
│   ├── requirements.txt         # Python dependencies
│   └── .env.example             # Environment variables template
│
├── cs-frontend/                 # Next.js Frontend
│   ├── app/
│   │   ├── page.tsx             # Main application page
│   │   ├── layout.tsx           # Root layout
│   │   └── globals.css          # Global styles
│   ├── components/
│   │   ├── ui/                  # Shadcn UI components
│   │   ├── inbox/               # Inbox-related components
│   │   │   ├── message-list.tsx
│   │   │   ├── message-detail.tsx
│   │   │   └── ai-analysis-panel.tsx
│   │   └── dashboard/
│   │       └── analytics-dashboard.tsx
│   ├── lib/
│   │   ├── api.ts               # API client
│   │   └── utils.ts             # Utility functions
│   ├── package.json
│   └── tsconfig.json
│
└── README.md                    # This file
```

## Tech Stack

### Backend

- **FastAPI**: Modern, fast Python web framework
- **SQLAlchemy**: SQL toolkit and ORM
- **SQLite**: Lightweight database (can be swapped for PostgreSQL)
- **Pydantic**: Data validation using Python type annotations
- **OpenAI API**: (Optional) For advanced AI analysis

### Frontend

- **Next.js 16+**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/UI**: High-quality, accessible component library
- **Lucide React**: Beautiful icon library
- **Recharts**: Composable charting library

## Getting Started

### Prerequisites

- **Python 3.9+** (for backend)
- **Node.js 18+** (for frontend)
- **pnpm** (or npm/yarn)
- **Git** (for version control)

### Quick Start

#### 1. Start Backend (Terminal 1)

#### 1. Start Backend (Terminal 1)

```bash
cd cs-backend

# Create virtual environment (first time only)
python -m venv venv

# Activate virtual environment
.\venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux

# Install dependencies (first time only)
pip install fastapi uvicorn sqlalchemy pydantic python-dotenv python-jose passlib bcrypt python-multipart

# Run the backend server
python main.py
```

**Backend will run on:** http://localhost:8000

**API Documentation:** http://localhost:8000/docs

#### 2. Start Frontend (Terminal 2 - NEW TERMINAL)

```bash
cd cs-frontend
```

#### Step 2: Install dependencies

```bash
pnpm install
# or
npm install
```

#### Step 3: (Optional) Configure API URL

Create a `.env.local` file:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

#### Step 4: Start the development server

````bash
pnpm dev
# or
npm run dev
#### 2. Start Frontend (Terminal 2 - NEW TERMINAL)
```bash
cd cs-frontend

# Install dependencies (first time only)
pnpm install

# Run the development server
pnpm dev
````

**Frontend will run on:** http://localhost:3000

---

## Demo Accounts

After starting both servers, **visit http://localhost:3000** - you'll be redirected to login.

### Available Accounts:

| Role         | Email                  | Password      | Access                           |
| ------------ | ---------------------- | ------------- | -------------------------------- |
| **Agent**    | `agent@example.com`    | `password123` | Full access + can load demo data |
| **Customer** | `customer@example.com` | `customer123` | View own messages only           |
| **Admin**    | `admin@example.com`    | `admin123`    | Full admin access                |

**Tip:** Click any account on the login page to auto-fill credentials.

---

## Loading Demo Data

1. **Login as Agent or Admin**
2. Click the **"Load Demo Data"** button in the header
3. This creates:
   - 3 demo user accounts (if not already exist)
   - 15 realistic customer support messages
   - AI analysis for each message (category, sentiment, summary, response)

---

## Features Overview

### Inbox View

1. Click on any message in the list to view full details
2. Review AI analysis in the right panel:
   - Category classification
   - Sentiment analysis with confidence score
   - Message summary
   - Suggested response draft
3. Use the suggested response as a starting point for your reply
4. Update message status using the workflow button:
   - New → In Progress → Resolved → Closed

### Dashboard View

- **Overview Cards**: Total messages, status breakdown
- **Sentiment Distribution**: Pie chart showing sentiment trends
- **Issue Categories**: Bar chart of issue types
- **Key Insights**: Actionable recommendations based on data

---

## AI Features Explained

### 1. Classification

Automatically categorizes messages into:

- **Billing**: Payment, refund, invoice issues
- **Technical**: Bugs, errors, technical problems
- **Feature Request**: Product enhancement suggestions
- **Account**: Login, password, profile issues
- **General**: Other inquiries

### 2. Sentiment Analysis

Detects customer emotional tone:

- **Positive**: Happy, satisfied customers
- **Neutral**: Factual, informational inquiries
- **Negative**: Frustrated customers
- **Very Negative**: Urgent, critical issues (high priority)

### 3. Summarization

Generates concise summaries of long messages for quick understanding.

### 4. Response Generation

Creates contextual, professional response drafts based on:

- Issue category
- Customer sentiment
- Message content

---

## API Endpoints

### Messages

- `GET /api/messages` - List all messages (with filters)
- `GET /api/messages/{id}` - Get specific message
- `POST /api/messages` - Create new message (auto-analyzes)
- `PATCH /api/messages/{id}` - Update message status
- `POST /api/messages/{id}/reanalyze` - Re-run AI analysis
- `DELETE /api/messages/{id}` - Delete message

### Analytics

- `GET /api/analytics/dashboard` - Get dashboard statistics

### Utilities

- `POST /api/seed-demo-data` - Populate with demo messages

**Full API documentation**: http://localhost:8000/docs

---

## Customization

### Adding Custom AI Logic

Edit `cs-backend/ai_service.py`:

```python
def _analyze_with_mock(content: str, subject: str) -> AIAnalysis:
    # Add your custom logic here
    pass
```

### Styling

- Modify `cs-frontend/app/globals.css` for theme colors
- Edit Tailwind config in component files for styling

### Database

To switch to PostgreSQL:

1. Update `DATABASE_URL` in `.env`
2. Install psycopg2: `pip install psycopg2-binary`
3. Restart backend

---

## Testing

### Backend Testing

```bash
# Test API endpoints
curl http://localhost:8000/api/messages
```

### Frontend Testing

- Use browser DevTools to inspect API calls
- Check console for any errors

---

## Troubleshooting

### Backend Issues

**Problem**: Module not found errors

```bash
# Solution: Ensure virtual environment is activated
.\venv\Scripts\activate  # Windows
source venv/bin/activate # Mac/Linux
```

**Problem**: Port 8000 already in use

```bash
# Solution: Change port in main.py or kill existing process
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:8000 | xargs kill
```

### Frontend Issues

**Problem**: Module not found errors

```bash
# Solution: Reinstall dependencies
rm -rf node_modules
pnpm install
```

**Problem**: API connection refused

- Ensure backend is running on port 8000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`

---

## Future Enhancements

- [ ] Real-time notifications using WebSockets
- [ ] Multi-agent assignment and routing
- [ ] Email integration (IMAP/SMTP)
- [ ] Knowledge base integration
- [ ] Conversation threading
- [ ] Advanced analytics with time-series data
- [ ] User authentication and roles (COMPLETED)
- [ ] Custom AI model fine-tuning

---

## Documentation

For more detailed information, see:

- **[Quick Start Guide](QUICKSTART.md)** - Fast reference for common tasks
- **[Authentication Guide](AUTH_GUIDE.md)** - Detailed auth setup and usage
- **[Deployment Guide](DEPLOYMENT.md)** - Production deployment instructions
- **[API Documentation](http://localhost:8000/docs)** - Interactive API docs (when backend is running)

---

## Contributing

This is a POC project. Feel free to:

1. Fork the repository
2. Create feature branches
3. Submit pull requests
4. Report issues

---

## License

This project is provided as-is for demonstration purposes.

---

## Support

For questions or issues:

- Check the [Deployment Guide](DEPLOYMENT.md) for production setup
- Review the [API Documentation](http://localhost:8000/docs) when backend is running
- Inspect component code in `cs-frontend/components/`
- Check AI logic in `cs-backend/ai_service.py`
- Open an issue in the repository

---

**Built for GDGOC - AI Customer Support Intelligence Platform**
