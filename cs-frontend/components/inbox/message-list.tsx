"use client";

import { Message } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatRelativeTime } from "@/lib/utils";
import { Mail, MailOpen, Clock, CheckCircle2, Circle } from "lucide-react";

interface MessageListProps {
  messages: Message[];
  selectedMessageId?: number;
  onSelectMessage: (message: Message) => void;
}

export function MessageList({
  messages,
  selectedMessageId,
  onSelectMessage,
}: MessageListProps) {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new":
        return <Mail className="h-4 w-4" />;
      case "in_progress":
        return <Clock className="h-4 w-4" />;
      case "resolved":
        return <CheckCircle2 className="h-4 w-4" />;
      case "closed":
        return <MailOpen className="h-4 w-4" />;
      default:
        return <Circle className="h-4 w-4" />;
    }
  };

  const getCategoryLabel = (category: string | null) => {
    if (!category) return "General";
    return category
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground p-8">
        <div className="text-center">
          <Mail className="h-12 w-12 mx-auto mb-4 opacity-20" />
          <p className="text-sm">No messages found</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-2 p-4 max-w-full">
        {messages.map((message) => (
          <Card
            key={message.id}
            className={`p-4 cursor-pointer transition-all hover:shadow-md overflow-hidden max-w-full ${
              selectedMessageId === message.id
                ? "ring-2 ring-primary bg-accent"
                : "hover:bg-accent/50"
            }`}
            onClick={() => onSelectMessage(message)}
          >
            <div className="space-y-2 w-48 max-w-full">
              <div className="flex items-start justify-between gap-2 max-w-full">
                <div className="flex-1 min-w-0 overflow-hidden">
                  <div className="flex items-center gap-2 mb-1 overflow-hidden">
                    <div className="flex-shrink-0">
                      {getStatusIcon(message.status)}
                    </div>
                    <h3 className="font-semibold text-sm truncate flex-1 min-w-0">
                      {message.subject}
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    From: {message.customer_name}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0 ml-2">
                  {formatRelativeTime(message.created_at)}
                </span>
              </div>

              {message.summary && (
                <p className="text-xs text-muted-foreground line-clamp-2 break-words overflow-hidden">
                  {message.summary}
                </p>
              )}

              <div className="flex flex-wrap gap-1.5 max-w-full">
                {message.category && (
                  <Badge variant="outline" className="text-xs flex-shrink-0">
                    {getCategoryLabel(message.category)}
                  </Badge>
                )}
                {message.sentiment && (
                  <Badge
                    variant={getSentimentColor(message.sentiment) as any}
                    className="text-xs flex-shrink-0"
                  >
                    {message.sentiment.replace("_", " ")}
                  </Badge>
                )}
                <Badge variant="secondary" className="text-xs flex-shrink-0">
                  {message.status.replace("_", " ")}
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
