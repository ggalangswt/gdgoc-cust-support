"""
FastAPI Main Application
AI Customer Support Intelligence Platform Backend
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import os
from dotenv import load_dotenv

from models import (
    Message, MessageCreate, MessageUpdate, AIAnalysis,
    MessageDB, MessageStatus, DashboardStats, SentimentStats,
    CategoryStats, IssueCategory, SentimentType,
    UserDB, User, UserLogin, UserCreate, Token, UserRole
)
from database import get_db, init_db
from ai_service import analyze_message
from auth import (
    get_password_hash, verify_password, create_access_token,
    get_current_user_id
)

# Load environment variables
load_dotenv()

# Lifespan event handler
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    init_db()
    print("🚀 Server started successfully!")
    print(f"📡 API running on http://localhost:{os.getenv('API_PORT', 8000)}")
    print(f"📚 Docs available at http://localhost:{os.getenv('API_PORT', 8000)}/docs")
    yield
    # Shutdown
    print("👋 Server shutting down")

# Initialize FastAPI app
app = FastAPI(
    title="AI Customer Support Intelligence API",
    description="Backend API for AI-powered customer support platform",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# API ENDPOINTS
# ============================================================================

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "running",
        "message": "AI Customer Support Intelligence API",
        "version": "1.0.0"
    }


# ============================================================================
# AUTHENTICATION ENDPOINTS
# ============================================================================

@app.post("/api/auth/login", response_model=Token)
async def login(user_login: UserLogin, db: Session = Depends(get_db)):
    """
    Login with email and password
    Returns JWT token and user information
    """
    # Find user by email
    user = db.query(UserDB).filter(UserDB.email == user_login.email).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Verify password
    if not verify_password(user_login.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Check if user is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": str(user.id), "role": user.role})
    
    # Convert to User model
    user_data = User(
        id=user.id,
        email=user.email,
        username=user.username,
        full_name=user.full_name,
        role=UserRole(user.role),
        is_active=bool(user.is_active),
        created_at=user.created_at
    )
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=user_data
    )


@app.post("/api/auth/register", response_model=User, status_code=201)
async def register(user_create: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user (customer only)
    """
    # Check if email already exists
    existing_user = db.query(UserDB).filter(UserDB.email == user_create.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Check if username already exists
    existing_username = db.query(UserDB).filter(UserDB.username == user_create.username).first()
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    # Create new user (force role to customer for public registration)
    hashed_password = get_password_hash(user_create.password)
    db_user = UserDB(
        email=user_create.email,
        username=user_create.username,
        full_name=user_create.full_name,
        hashed_password=hashed_password,
        role=UserRole.CUSTOMER.value,  # Force customer role
        is_active=1
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user


@app.get("/api/auth/me", response_model=User)
async def get_current_user(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """
    Get current logged-in user information
    """
    user = db.query(UserDB).filter(UserDB.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user


@app.post("/api/messages", response_model=Message, status_code=201)
async def create_message(message: MessageCreate, db: Session = Depends(get_db)):
    """
    Create a new customer support message and analyze it with AI
    
    This endpoint:
    1. Receives a new customer message
    2. Analyzes it using AI (classification, sentiment, summarization)
    3. Stores everything in the database
    4. Returns the complete message with AI analysis
    """
    try:
        # Perform AI analysis
        print(f"🤖 Analyzing message: {message.subject}")
        ai_analysis = analyze_message(message.content, message.subject)
        
        # Create database entry with AI analysis
        db_message = MessageDB(
            customer_name=message.customer_name,
            customer_email=message.customer_email,
            subject=message.subject,
            content=message.content,
            status=MessageStatus.NEW.value,
            category=ai_analysis.category.value,
            sentiment=ai_analysis.sentiment.value,
            sentiment_score=ai_analysis.sentiment_score,
            summary=ai_analysis.summary,
            suggested_response=ai_analysis.suggested_response
        )
        
        db.add(db_message)
        db.commit()
        db.refresh(db_message)
        
        print(f"✅ Message created with ID: {db_message.id}")
        return db_message
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error creating message: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing message: {str(e)}")


@app.get("/api/messages", response_model=List[Message])
async def get_messages(
    status: str = None,
    category: str = None,
    sentiment: str = None,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """
    Get all messages with optional filtering
    
    Query Parameters:
    - status: Filter by message status (new, in_progress, resolved, closed)
    - category: Filter by issue category
    - sentiment: Filter by sentiment
    - limit: Maximum number of messages to return (default: 50)
    """
    query = db.query(MessageDB)
    
    if status:
        query = query.filter(MessageDB.status == status)
    if category:
        query = query.filter(MessageDB.category == category)
    if sentiment:
        query = query.filter(MessageDB.sentiment == sentiment)
    
    messages = query.order_by(MessageDB.created_at.desc()).limit(limit).all()
    return messages


@app.get("/api/messages/{message_id}", response_model=Message)
async def get_message(message_id: int, db: Session = Depends(get_db)):
    """Get a specific message by ID"""
    message = db.query(MessageDB).filter(MessageDB.id == message_id).first()
    
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    return message


@app.patch("/api/messages/{message_id}", response_model=Message)
async def update_message(
    message_id: int,
    update: MessageUpdate,
    db: Session = Depends(get_db)
):
    """
    Update a message (e.g., change status)
    """
    message = db.query(MessageDB).filter(MessageDB.id == message_id).first()
    
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    if update.status:
        message.status = update.status.value
        message.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(message)
    
    return message


@app.post("/api/messages/{message_id}/reanalyze", response_model=AIAnalysis)
async def reanalyze_message(message_id: int, db: Session = Depends(get_db)):
    """
    Re-run AI analysis on an existing message
    Useful if AI service has been updated or for testing
    """
    message = db.query(MessageDB).filter(MessageDB.id == message_id).first()
    
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    # Perform AI analysis
    ai_analysis = analyze_message(message.content, message.subject)
    
    # Update message with new analysis
    message.category = ai_analysis.category.value
    message.sentiment = ai_analysis.sentiment.value
    message.sentiment_score = ai_analysis.sentiment_score
    message.summary = ai_analysis.summary
    message.suggested_response = ai_analysis.suggested_response
    message.updated_at = datetime.utcnow()
    
    db.commit()
    
    return ai_analysis


@app.get("/api/analytics/dashboard", response_model=DashboardStats)
async def get_dashboard_stats(db: Session = Depends(get_db)):
    """
    Get comprehensive dashboard statistics
    
    Returns:
    - Total message counts by status
    - Sentiment distribution
    - Category distribution
    - Average sentiment score
    """
    all_messages = db.query(MessageDB).all()
    
    # Status counts
    total_messages = len(all_messages)
    new_messages = sum(1 for m in all_messages if m.status == MessageStatus.NEW.value)
    in_progress = sum(1 for m in all_messages if m.status == MessageStatus.IN_PROGRESS.value)
    resolved = sum(1 for m in all_messages if m.status == MessageStatus.RESOLVED.value)
    
    # Sentiment distribution
    positive = sum(1 for m in all_messages if m.sentiment == SentimentType.POSITIVE.value)
    neutral = sum(1 for m in all_messages if m.sentiment == SentimentType.NEUTRAL.value)
    negative = sum(1 for m in all_messages if m.sentiment == SentimentType.NEGATIVE.value)
    very_negative = sum(1 for m in all_messages if m.sentiment == SentimentType.VERY_NEGATIVE.value)
    
    # Category distribution
    billing = sum(1 for m in all_messages if m.category == IssueCategory.BILLING.value)
    technical = sum(1 for m in all_messages if m.category == IssueCategory.TECHNICAL.value)
    feature_request = sum(1 for m in all_messages if m.category == IssueCategory.FEATURE_REQUEST.value)
    account = sum(1 for m in all_messages if m.category == IssueCategory.ACCOUNT.value)
    general = sum(1 for m in all_messages if m.category == IssueCategory.GENERAL.value)
    
    # Average sentiment score
    sentiment_scores = [m.sentiment_score for m in all_messages if m.sentiment_score]
    avg_sentiment_score = sum(sentiment_scores) / len(sentiment_scores) if sentiment_scores else 0.5
    
    return DashboardStats(
        total_messages=total_messages,
        new_messages=new_messages,
        in_progress=in_progress,
        resolved=resolved,
        sentiment_stats=SentimentStats(
            positive=positive,
            neutral=neutral,
            negative=negative,
            very_negative=very_negative,
            total=total_messages
        ),
        category_stats=CategoryStats(
            billing=billing,
            technical=technical,
            feature_request=feature_request,
            account=account,
            general=general
        ),
        avg_sentiment_score=avg_sentiment_score
    )


@app.delete("/api/messages/{message_id}")
async def delete_message(message_id: int, db: Session = Depends(get_db)):
    """Delete a message (for testing purposes)"""
    message = db.query(MessageDB).filter(MessageDB.id == message_id).first()
    
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    db.delete(message)
    db.commit()
    
    return {"message": "Message deleted successfully"}


# ============================================================================
# DEMO DATA SEEDING (Optional - for testing)
# ============================================================================

@app.post("/api/seed-demo-data")
async def seed_demo_data(db: Session = Depends(get_db)):
    """
    Seed the database with demo users and messages for testing
    (Only use this for development/demo purposes)
    """
    # Create demo users if they don't exist
    demo_users = [
        {
            "email": "agent@example.com",
            "username": "agent1",
            "full_name": "Alex Agent",
            "password": "password123",
            "role": UserRole.AGENT.value
        },
        {
            "email": "admin@example.com",
            "username": "admin",
            "full_name": "Admin User",
            "password": "admin123",
            "role": UserRole.ADMIN.value
        },
        {
            "email": "customer@example.com",
            "username": "customer1",
            "full_name": "Customer One",
            "password": "customer123",
            "role": UserRole.CUSTOMER.value
        }
    ]
    
    created_users = []
    for user_data in demo_users:
        existing_user = db.query(UserDB).filter(UserDB.email == user_data["email"]).first()
        if not existing_user:
            db_user = UserDB(
                email=user_data["email"],
                username=user_data["username"],
                full_name=user_data["full_name"],
                hashed_password=get_password_hash(user_data["password"]),
                role=user_data["role"],
                is_active=1
            )
            db.add(db_user)
            created_users.append(user_data["email"])
    
    db.commit()
    
    # Create demo messages
    demo_messages = [
        {
            "customer_name": "John Smith",
            "customer_email": "john.smith@example.com",
            "subject": "Billing Issue - Double Charge",
            "content": "Hello, I noticed I was charged twice for my subscription this month. Can you please look into this and process a refund? This is very frustrating as it's not the first time this has happened. My account shows two charges of $49.99 on January 15th."
        },
        {
            "customer_name": "Sarah Johnson",
            "customer_email": "sarah.j@example.com",
            "subject": "Feature Request: Dark Mode",
            "content": "Hi! I love your product but would really appreciate having a dark mode option. It would make using the app at night much more comfortable. Many of my colleagues have been asking for this feature too. Thank you for considering this!"
        },
        {
            "customer_name": "Mike Chen",
            "customer_email": "mchen@example.com",
            "subject": "Cannot Login to Account",
            "content": "I'm unable to login to my account. I've tried resetting my password multiple times but I'm not receiving the reset email. This is urgent as I need to access my data for a presentation tomorrow. Please help ASAP!"
        },
        {
            "customer_name": "Emily Rodriguez",
            "customer_email": "emily.r@example.com",
            "subject": "App Crashing on Startup",
            "content": "The application crashes immediately after I open it. I've tried reinstalling but the problem persists. I'm on Windows 11. Error code: 0x8007042. Please help ASAP! This is affecting my work."
        },
        {
            "customer_name": "David Lee",
            "customer_email": "david.lee@example.com",
            "subject": "Thank You for Great Support",
            "content": "I just wanted to thank your team for the excellent customer service. You resolved my issue quickly and professionally. Keep up the great work!"
        },
        {
            "customer_name": "Rachel Green",
            "customer_email": "rachel.g@example.com",
            "subject": "Subscription Cancellation Request",
            "content": "I would like to cancel my subscription effective immediately. I've been having issues with the service quality and it's not meeting my needs anymore. Please process this cancellation and confirm."
        },
        {
            "customer_name": "Tom Wilson",
            "customer_email": "tom.wilson@example.com",
            "subject": "Feature Request: Export to PDF",
            "content": "Could you add an export to PDF feature? It would be really helpful for creating reports. This would save me a lot of time in my workflow."
        },
        {
            "customer_name": "Lisa Anderson",
            "customer_email": "lisa.a@example.com",
            "subject": "Performance Issues with Large Files",
            "content": "The app becomes very slow when I try to upload files larger than 100MB. It sometimes freezes completely. Is this a known issue? I'm on a high-speed connection so it's not my internet."
        },
        {
            "customer_name": "James Brown",
            "customer_email": "james.b@example.com",
            "subject": "Question About API Documentation",
            "content": "I'm trying to integrate your API but the documentation seems outdated. The endpoints mentioned don't match what I'm seeing. Can you point me to the latest API docs?"
        },
        {
            "customer_name": "Maria Garcia",
            "customer_email": "maria.g@example.com",
            "subject": "URGENT: Data Loss After Update",
            "content": "After the latest update, all my saved data is gone! This is unacceptable! I had months of work stored and now it's all disappeared. I need this resolved IMMEDIATELY or I want a full refund!"
        },
        {
            "customer_name": "Chris Taylor",
            "customer_email": "chris.t@example.com",
            "subject": "Love the New UI Update!",
            "content": "Just wanted to say the new UI looks fantastic! Much cleaner and easier to navigate. Great job team!"
        },
        {
            "customer_name": "Amanda White",
            "customer_email": "amanda.w@example.com",
            "subject": "Mobile App Not Syncing",
            "content": "The mobile app isn't syncing with the desktop version. Changes I make on my phone don't show up on my computer. I've tried logging out and back in but it still doesn't work."
        },
        {
            "customer_name": "Robert Martinez",
            "customer_email": "robert.m@example.com",
            "subject": "Discount Code Not Working",
            "content": "I have a 20% discount code from your email campaign but it's not applying at checkout. The code is SAVE20. Can you help?"
        },
        {
            "customer_name": "Jennifer Davis",
            "customer_email": "jennifer.d@example.com",
            "subject": "Request for Team Plan Information",
            "content": "We're interested in upgrading to a team plan for our company of 15 people. Can you send me pricing information and what features are included?"
        },
        {
            "customer_name": "Kevin Thompson",
            "customer_email": "kevin.t@example.com",
            "subject": "Security Concern - Suspicious Activity",
            "content": "I noticed some login attempts from unfamiliar locations in my account activity log. I'm concerned my account may have been compromised. Please advise on security measures I should take."
        }
    ]
    
    created_messages = []
    for msg_data in demo_messages:
        message = MessageCreate(**msg_data)
        ai_analysis = analyze_message(message.content, message.subject)
        
        db_message = MessageDB(
            customer_name=message.customer_name,
            customer_email=message.customer_email,
            subject=message.subject,
            content=message.content,
            status=MessageStatus.NEW.value,
            category=ai_analysis.category.value,
            sentiment=ai_analysis.sentiment.value,
            sentiment_score=ai_analysis.sentiment_score,
            summary=ai_analysis.summary,
            suggested_response=ai_analysis.suggested_response
        )
        
        db.add(db_message)
        created_messages.append(message.subject)
    
    db.commit()
    
    return {
        "message": "Demo data seeded successfully",
        "users_created": len(created_users),
        "messages_created": len(created_messages),
        "users": created_users,
        "messages": created_messages
    }


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("API_PORT", 8000))
    # Run without reload for direct execution
    uvicorn.run(app, host="0.0.0.0", port=port)
