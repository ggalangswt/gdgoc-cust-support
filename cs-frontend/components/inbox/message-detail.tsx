"use client";

import { Message } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDate } from "@/lib/utils";
import { User, Mail, Calendar, Tag, ArrowRight } from "lucide-react";

interface MessageDetailProps {
  message: Message;
  onStatusChange: (messageId: number, status: Message["status"]) => void;
}

export function MessageDetail({ message, onStatusChange }: MessageDetailProps) {
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

  const getStatusLabel = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getNextStatus = (currentStatus: string): Message["status"] | null => {
    switch (currentStatus) {
      case "new":
        return "in_progress";
      case "in_progress":
        return "resolved";
      case "resolved":
        return "closed";
      default:
        return null;
    }
  };

  const nextStatus = getNextStatus(message.status);

  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          <div>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">{message.subject}</h2>
                <div className="flex flex-wrap gap-2">
                  {message.category && (
                    <Badge variant="outline">
                      <Tag className="h-3 w-3 mr-1" />
                      {getCategoryLabel(message.category)}
                    </Badge>
                  )}
                  {message.sentiment && (
                    <Badge
                      variant={getSentimentColor(message.sentiment) as any}
                    >
                      {message.sentiment.replace("_", " ")}
                    </Badge>
                  )}
                  <Badge variant="secondary">
                    {getStatusLabel(message.status)}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{message.customer_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>{message.customer_email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(message.created_at)}</span>
              </div>
            </div>
          </div>

          {message.summary && (
            <Card className="bg-accent/50">
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  AI Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{message.summary}</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Original Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </CardContent>
          </Card>

          {message.suggested_response && (
            <Card className="border-primary/50 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs">
                    AI
                  </span>
                  Suggested Response
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">
                  {message.suggested_response}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </ScrollArea>

      <div className="border-t p-4 bg-muted/50">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Current Status:{" "}
            <span className="font-medium text-foreground">
              {getStatusLabel(message.status)}
            </span>
          </div>
          {nextStatus && (
            <Button
              onClick={() => onStatusChange(message.id, nextStatus)}
              className="gap-2"
            >
              Move to {getStatusLabel(nextStatus)}
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
