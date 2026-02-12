"use client";

import { DashboardStats } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
} from "recharts";
import {
  MessageSquare,
  Clock,
  CheckCircle2,
  TrendingUp,
  MailOpen,
  AlertTriangle,
  Inbox,
  Wrench,
} from "lucide-react";

interface DashboardProps {
  stats: DashboardStats;
}

export function Dashboard({ stats }: DashboardProps) {
  const sentimentData = [
    {
      name: "Positive",
      value: stats.sentiment_stats.positive,
      color: "#22c55e",
    },
    { name: "Neutral", value: stats.sentiment_stats.neutral, color: "#94a3b8" },
    {
      name: "Negative",
      value: stats.sentiment_stats.negative,
      color: "#f59e0b",
    },
    {
      name: "Very Negative",
      value: stats.sentiment_stats.very_negative,
      color: "#ef4444",
    },
  ];

  const categoryData = [
    { name: "Billing", value: stats.category_stats.billing },
    { name: "Technical", value: stats.category_stats.technical },
    { name: "Features", value: stats.category_stats.feature_request },
    { name: "Account", value: stats.category_stats.account },
    { name: "General", value: stats.category_stats.general },
  ];

  const statusData = [
    {
      label: "New",
      value: stats.new_messages,
      icon: MailOpen,
      color: "text-purple-600",
    },
    {
      label: "In Progress",
      value: stats.in_progress,
      icon: Clock,
      color: "text-purple-400",
    },
    {
      label: "Resolved",
      value: stats.resolved,
      icon: CheckCircle2,
      color: "text-green-600",
    },
  ];

  const avgSentimentPercentage = Math.round(stats.avg_sentiment_score * 100);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Messages
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_messages}</div>
            <p className="text-xs text-muted-foreground">
              All customer inquiries
            </p>
          </CardContent>
        </Card>

        {statusData.map((status) => {
          const Icon = status.icon;
          return (
            <Card key={status.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {status.label}
                </CardTitle>
                <Icon className={`h-4 w-4 ${status.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{status.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.total_messages > 0
                    ? `${Math.round((status.value / stats.total_messages) * 100)}% of total`
                    : "No messages"}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Sentiment Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      percent > 0
                        ? `${name}: ${(percent * 100).toFixed(0)}%`
                        : ""
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Average Sentiment Score:{" "}
                <span className="font-bold text-foreground">
                  {avgSentimentPercentage}%
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Issue Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="value"
                    fill="rgb(139 92 246)"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {stats.sentiment_stats.very_negative > 0 && (
              <div className="flex items-start gap-2 p-3 bg-destructive/10 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">High Priority Issues</p>
                  <p className="text-xs text-muted-foreground">
                    {stats.sentiment_stats.very_negative} message
                    {stats.sentiment_stats.very_negative > 1 ? "s" : ""} with
                    very negative sentiment requiring immediate attention
                  </p>
                </div>
              </div>
            )}

            {stats.new_messages > 10 && (
              <div className="flex items-start gap-2 p-3 bg-yellow-100  rounded-lg">
                <Inbox className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Backlog Alert</p>
                  <p className="text-xs text-muted-foreground">
                    {stats.new_messages} new messages waiting for response
                  </p>
                </div>
              </div>
            )}

            {stats.resolved > stats.in_progress && stats.total_messages > 0 && (
              <div className="flex items-start gap-2 p-3 bg-green-100 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Good Response Rate</p>
                  <p className="text-xs text-muted-foreground">
                    {Math.round((stats.resolved / stats.total_messages) * 100)}%
                    of messages have been resolved
                  </p>
                </div>
              </div>
            )}

            {stats.category_stats.technical > stats.total_messages * 0.3 && (
              <div className="flex items-start gap-2 p-3 bg-purple-100 rounded-lg">
                <Wrench className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">
                    Technical Issues Trending
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {stats.category_stats.technical} technical support requests
                    - consider creating a FAQ
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
