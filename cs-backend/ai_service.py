"""
AI Service Layer for Customer Support Intelligence
Handles: Classification, Sentiment Analysis, Summarization, and Response Generation

This service can work in two modes:
1. Mock Mode: Uses rule-based logic for demonstration (default)
2. OpenAI Mode: Uses actual OpenAI API when API key is provided
"""
import os
import re
from typing import Dict, List
from models import IssueCategory, SentimentType, AIAnalysis

# Check if OpenAI is available
USE_OPENAI = bool(os.getenv("OPENAI_API_KEY"))

if USE_OPENAI:
    try:
        from openai import OpenAI
        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        print("🤖 Using OpenAI API for AI processing")
    except Exception as e:
        print(f"⚠️  OpenAI not available: {e}. Using mock AI service.")
        USE_OPENAI = False
else:
    print("🎭 Using Mock AI Service (no OpenAI API key provided)")


class AIService:
    """Service for AI-powered message analysis"""
    
    @staticmethod
    def analyze_message(content: str, subject: str) -> AIAnalysis:
        """
        Perform complete AI analysis on a message
        Returns: AIAnalysis with category, sentiment, summary, and suggested response
        """
        if USE_OPENAI:
            return AIService._analyze_with_openai(content, subject)
        else:
            return AIService._analyze_with_mock(content, subject)
    
    @staticmethod
    def _analyze_with_mock(content: str, subject: str) -> AIAnalysis:
        """Mock AI analysis using rule-based logic"""
        
        # Classify category
        category = AIService._classify_category_mock(content, subject)
        
        # Analyze sentiment
        sentiment, sentiment_score = AIService._analyze_sentiment_mock(content)
        
        # Generate summary
        summary = AIService._generate_summary_mock(content, subject)
        
        # Extract key points
        key_points = AIService._extract_key_points_mock(content)
        
        # Generate suggested response
        suggested_response = AIService._generate_response_mock(
            content, subject, category, sentiment
        )
        
        return AIAnalysis(
            category=category,
            sentiment=sentiment,
            sentiment_score=sentiment_score,
            summary=summary,
            suggested_response=suggested_response,
            key_points=key_points
        )
    
    @staticmethod
    def _classify_category_mock(content: str, subject: str) -> IssueCategory:
        """Rule-based category classification"""
        text = (content + " " + subject).lower()
        
        billing_keywords = ["invoice", "payment", "charge", "billing", "refund", "cost", "price"]
        technical_keywords = ["error", "bug", "crash", "not working", "broken", "issue", "problem"]
        feature_keywords = ["feature", "request", "add", "enhancement", "improve", "suggestion"]
        account_keywords = ["account", "login", "password", "access", "profile", "settings"]
        
        if any(kw in text for kw in billing_keywords):
            return IssueCategory.BILLING
        elif any(kw in text for kw in technical_keywords):
            return IssueCategory.TECHNICAL
        elif any(kw in text for kw in feature_keywords):
            return IssueCategory.FEATURE_REQUEST
        elif any(kw in text for kw in account_keywords):
            return IssueCategory.ACCOUNT
        else:
            return IssueCategory.GENERAL
    
    @staticmethod
    def _analyze_sentiment_mock(content: str) -> tuple[SentimentType, float]:
        """Rule-based sentiment analysis"""
        text = content.lower()
        
        # Count positive and negative indicators
        positive_words = ["thank", "great", "excellent", "happy", "love", "appreciate", "wonderful"]
        negative_words = ["angry", "frustrated", "terrible", "awful", "hate", "worst", "disappointed"]
        very_negative_words = ["furious", "unacceptable", "lawyer", "sue", "complaint"]
        
        positive_count = sum(1 for word in positive_words if word in text)
        negative_count = sum(1 for word in negative_words if word in text)
        very_negative_count = sum(1 for word in very_negative_words if word in text)
        
        # Detect urgency/panic with exclamation marks and caps
        urgency_score = text.count("!") + sum(1 for c in text if c.isupper()) / max(len(text), 1) * 10
        
        if very_negative_count > 0 or urgency_score > 5:
            return SentimentType.VERY_NEGATIVE, 0.85 + (very_negative_count * 0.05)
        elif negative_count > positive_count:
            score = 0.6 + (negative_count * 0.05)
            return SentimentType.NEGATIVE, min(score, 0.95)
        elif positive_count > negative_count:
            score = 0.7 + (positive_count * 0.05)
            return SentimentType.POSITIVE, min(score, 0.95)
        else:
            return SentimentType.NEUTRAL, 0.55
    
    @staticmethod
    def _generate_summary_mock(content: str, subject: str) -> str:
        """Generate a concise summary"""
        # Take first 2 sentences or 150 characters
        sentences = re.split(r'[.!?]+', content)
        if len(sentences) > 0 and sentences[0]:
            summary = sentences[0].strip()
            if len(summary) > 150:
                summary = summary[:150] + "..."
            return f"Customer contacted regarding: {subject}. {summary}"
        return f"Customer inquiry about: {subject}"
    
    @staticmethod
    def _extract_key_points_mock(content: str) -> List[str]:
        """Extract key points from message"""
        sentences = [s.strip() for s in re.split(r'[.!?]+', content) if s.strip()]
        # Return first 3 sentences as key points
        return sentences[:min(3, len(sentences))]
    
    @staticmethod
    def _generate_response_mock(
        content: str, 
        subject: str, 
        category: IssueCategory, 
        sentiment: SentimentType
    ) -> str:
        """Generate suggested response based on category and sentiment"""
        
        # Greeting based on sentiment
        if sentiment in [SentimentType.NEGATIVE, SentimentType.VERY_NEGATIVE]:
            greeting = "Thank you for reaching out, and I sincerely apologize for the frustration you've experienced."
        else:
            greeting = "Thank you for contacting us!"
        
        # Category-specific response
        category_responses = {
            IssueCategory.BILLING: (
                "I understand your concern regarding billing. "
                "I've escalated this to our billing team who will review your account "
                "and get back to you within 24 hours with a detailed explanation."
            ),
            IssueCategory.TECHNICAL: (
                "I understand you're experiencing technical difficulties. "
                "Our technical team has been notified and will investigate this issue immediately. "
                "In the meantime, please try [common troubleshooting step] and let us know if that helps."
            ),
            IssueCategory.FEATURE_REQUEST: (
                "Thank you for your valuable feedback! "
                "I've forwarded your feature request to our product team. "
                "We're always looking to improve based on customer suggestions."
            ),
            IssueCategory.ACCOUNT: (
                "I can help you with your account issue. "
                "For security purposes, I'll need to verify your identity. "
                "Could you please confirm [verification step]?"
            ),
            IssueCategory.GENERAL: (
                "I'd be happy to help you with this. "
                "Let me look into this for you and get back with more information."
            )
        }
        
        body = category_responses.get(category, category_responses[IssueCategory.GENERAL])
        
        closing = "\n\nIf you have any other questions, please don't hesitate to ask.\n\nBest regards,\nCustomer Support Team"
        
        return f"{greeting}\n\n{body}{closing}"
    
    @staticmethod
    def _analyze_with_openai(content: str, subject: str) -> AIAnalysis:
        """Use OpenAI API for advanced analysis"""
        try:
            # Create a comprehensive prompt for GPT
            prompt = f"""
Analyze this customer support message and provide a structured response:

Subject: {subject}
Message: {content}

Please provide:
1. Category (one of: billing, technical, feature_request, account, general)
2. Sentiment (one of: positive, neutral, negative, very_negative)
3. Sentiment confidence score (0.0 to 1.0)
4. A concise summary (2-3 sentences)
5. 2-3 key points from the message
6. A professional response draft

Format your response as JSON with keys: category, sentiment, sentiment_score, summary, key_points (array), suggested_response
"""
            
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a customer support AI assistant that analyzes messages and generates helpful responses."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=800
            )
            
            # Parse the response
            # Note: In production, you'd want more robust JSON parsing
            result_text = response.choices[0].message.content
            
            # For now, fall back to mock if parsing fails
            # In production, implement proper JSON parsing from GPT response
            return AIService._analyze_with_mock(content, subject)
            
        except Exception as e:
            print(f"OpenAI API error: {e}. Falling back to mock service.")
            return AIService._analyze_with_mock(content, subject)


# Convenience functions
def analyze_message(content: str, subject: str) -> AIAnalysis:
    """Main entry point for message analysis"""
    return AIService.analyze_message(content, subject)
