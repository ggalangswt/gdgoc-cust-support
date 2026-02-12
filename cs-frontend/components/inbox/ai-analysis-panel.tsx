"use client";

import { Message } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, TrendingUp, Sparkles, Tag, MessageSquare } from "lucide-react";

interface AIAnalysisPanelProps {
  message: Message;
}

export function AIAnalysisPanel({ message }: AIAnalysisPanelProps) {
  const getSentimentColor = (sentiment: string | null) => {
    switch (sentiment) {
      case "positive":
        return "success";
      case "neutral":
        return "secondary";
      case "negative":
        return "warning";
      case "very_negative":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getCategoryLabel = (category: string | null) => {
    if (!category) return "General";
    return category
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getSentimentDescription = (sentiment: string | null) => {
    switch (sentiment) {
      case "positive":
        return "Customer is satisfied and happy";
      case "neutral":
        return "Customer has a neutral tone";
      case "negative":
        return "Customer is frustrated or unhappy";
      case "very_negative":
        return "Customer is very upset - high priority!";
      default:
        return "Sentiment not analyzed";
    }
  };

  const confidencePercentage = message.sentiment_score
    ? Math.round(message.sentiment_score * 100)
    : 0;

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground">
          <Brain className="h-4 w-4" />
        </div>
        <h3 className="text-lg font-semibold">AI Analysis</h3>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Issue Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          {message.category ? (
            <div>
              <Badge variant="outline" className="mb-2">
                {getCategoryLabel(message.category)}
              </Badge>
              <p className="text-xs text-muted-foreground">
                Automatically classified based on message content
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Not classified</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Sentiment Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {message.sentiment ? (
            <>
              <div className="flex items-center justify-between">
                <Badge variant={getSentimentColor(message.sentiment) as any}>
                  {message.sentiment.replace("_", " ")}
                </Badge>
                <span className="text-sm font-medium">
                  {confidencePercentage}%
                </span>
              </div>
              <Progress value={confidencePercentage} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {getSentimentDescription(message.sentiment)}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Not analyzed</p>
          )}
        </CardContent>
      </Card>

      {message.summary && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Quick Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{message.summary}</p>
          </CardContent>
        </Card>
      )}

      <Card className="bg-primary/5 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-xs text-muted-foreground">
            {message.sentiment === "very_negative" && (
              <li className="flex items-start gap-2">
                <span className="text-destructive">•</span>
                <span>High priority - Escalate to senior support</span>
              </li>
            )}
            {message.sentiment === "negative" && (
              <li className="flex items-start gap-2">
                <span className="text-warning">•</span>
                <span>Handle with empathy and urgency</span>
              </li>
            )}
            {message.category === "billing" && (
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Review account billing history before responding</span>
              </li>
            )}
            {message.category === "technical" && (
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Gather system logs and error details</span>
              </li>
            )}
            {message.suggested_response && (
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Review and customize the AI-generated response</span>
              </li>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
