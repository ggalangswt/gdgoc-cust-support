"""
Pydantic models for request/response validation and SQLAlchemy models for database
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum
from sqlalchemy import Column, Integer, String, Text, DateTime, Float, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# SQLAlchemy Base
Base = declarative_base()

# Enums
class UserRole(str, Enum):
    CUSTOMER = "customer"
    AGENT = "agent"
    ADMIN = "admin"

class MessageStatus(str, Enum):
    NEW = "new"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    CLOSED = "closed"

class IssueCategory(str, Enum):
    BILLING = "billing"
    TECHNICAL = "technical"
    FEATURE_REQUEST = "feature_request"
    ACCOUNT = "account"
    GENERAL = "general"

class SentimentType(str, Enum):
    POSITIVE = "positive"
    NEUTRAL = "neutral"
    NEGATIVE = "negative"
    VERY_NEGATIVE = "very_negative"

# SQLAlchemy Database Models
class UserDB(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    full_name = Column(String(100), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False, default=UserRole.CUSTOMER.value)
    is_active = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)

class MessageDB(Base):
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String(100), nullable=False)
    customer_email = Column(String(100), nullable=False)
    subject = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)
    status = Column(String(20), default=MessageStatus.NEW.value)
    category = Column(String(50), nullable=True)
    sentiment = Column(String(20), nullable=True)
    sentiment_score = Column(Float, nullable=True)
    summary = Column(Text, nullable=True)
    suggested_response = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Pydantic Models for API
class MessageBase(BaseModel):
    customer_name: str = Field(..., min_length=1, max_length=100)
    customer_email: str = Field(..., min_length=1, max_length=100)
    subject: str = Field(..., min_length=1, max_length=200)
    content: str = Field(..., min_length=1)

class MessageCreate(MessageBase):
    pass

class AIAnalysis(BaseModel):
    """AI-generated analysis of a message"""
    category: IssueCategory
    sentiment: SentimentType
    sentiment_score: float = Field(..., ge=0.0, le=1.0, description="Sentiment confidence score")
    summary: str = Field(..., description="Concise summary of the message")
    suggested_response: str = Field(..., description="AI-generated response draft")
    key_points: List[str] = Field(default=[], description="Key points extracted from message")

class Message(MessageBase):
    """Complete message with AI analysis"""
    id: int
    status: MessageStatus
    category: Optional[IssueCategory] = None
    sentiment: Optional[SentimentType] = None
    sentiment_score: Optional[float] = None
    summary: Optional[str] = None
    suggested_response: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class MessageUpdate(BaseModel):
    status: Optional[MessageStatus] = None

class SentimentStats(BaseModel):
    """Analytics data for dashboard"""
    positive: int
    neutral: int
    negative: int
    very_negative: int
    total: int

class CategoryStats(BaseModel):
    """Category distribution statistics"""
    billing: int
    technical: int
    feature_request: int
    account: int
    general: int

class DashboardStats(BaseModel):
    """Complete dashboard statistics"""
    total_messages: int
    new_messages: int
    in_progress: int
    resolved: int
    sentiment_stats: SentimentStats
    category_stats: CategoryStats
    avg_sentiment_score: float

# Authentication Models
class UserLogin(BaseModel):
    email: str
    password: str

class UserCreate(BaseModel):
    email: str
    username: str
    full_name: str
    password: str
    role: UserRole = UserRole.CUSTOMER

class User(BaseModel):
    id: int
    email: str
    username: str
    full_name: str
    role: UserRole
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: User
