"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api, Message, DashboardStats } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { MessageList } from "@/components/inbox/message-list";
import { MessageDetail } from "@/components/inbox/message-detail";
import { AIAnalysisPanel } from "@/components/inbox/ai-analysis-panel";
import { Dashboard } from "@/components/dashboard/analytics-dashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  LayoutDashboard,
  Inbox,
  RefreshCw,
  Sparkles,
  Loader2,
  LogOut,
  User as UserIcon,
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { user, loading: authLoading, logout, isAgent, isCustomer } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("inbox");

  const fetchData = async () => {
    try {
      setRefreshing(true);
      const [messagesData, statsData] = await Promise.all([
        api.getMessages({ limit: 100 }),
        api.getDashboardStats(),
      ]);
      setMessages(messagesData);
      setDashboardStats(statsData);

      if (!selectedMessage && messagesData.length > 0) {
        setSelectedMessage(messagesData[0]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
    if (user && isAgent) {
      fetchData();
    } else if (user && isCustomer) {
      setLoading(false);
    }
  }, [authLoading, user, isAgent, isCustomer]);

  const handleStatusChange = async (
    messageId: number,
    status: Message["status"],
  ) => {
    try {
      const updatedMessage = await api.updateMessageStatus(messageId, status);

      setMessages(
        messages.map((m) => (m.id === messageId ? updatedMessage : m)),
      );

      if (selectedMessage?.id === messageId) {
        setSelectedMessage(updatedMessage);
      }

      const stats = await api.getDashboardStats();
      setDashboardStats(stats);
    } catch (error) {
      console.error("Error updating message status:", error);
    }
  };

  const handleSeedDemoData = async () => {
    try {
      setRefreshing(true);
      await api.seedDemoData();
      await fetchData();
    } catch (error) {
      console.error("Error seeding demo data:", error);
    }
  };

  if (authLoading || loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (isCustomer) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent">
                  <UserIcon className="h-4 w-4" />
                  <div>
                    <p className="text-xs font-medium">{user.full_name}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {user.role}
                    </p>
                  </div>
                </div>
              </div>
              <Button
                onClick={logout}
                variant="ghost"
                size="icon"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-6">
              <Sparkles className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Customer Portal</h1>
            <h2 className="text-2xl font-semibold text-primary mb-6">
              Coming Soon
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              We're working hard to bring you an amazing customer support
              experience. The customer portal will be available soon with
              features to track your tickets, view support history, and get
              instant help.
            </p>
            <Card className="p-8 text-left">
              <h3 className="text-lg font-semibold mb-4">What's Coming:</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">
                    1
                  </div>
                  <span>Submit and track support tickets</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">
                    2
                  </div>
                  <span>View your support history and past conversations</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">
                    3
                  </div>
                  <span>Get real-time updates on ticket status</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">
                    4
                  </div>
                  <span>Access our knowledge base and FAQs</span>
                </li>
              </ul>
            </Card>
            <p className="text-sm text-muted-foreground mt-8">
              For now, please login as an{" "}
              <span className="font-semibold text-primary">agent</span> or{" "}
              <span className="font-semibold text-primary">admin</span> to
              access the dashboard.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent">
                <UserIcon className="h-4 w-4" />
                <div>
                  <p className="text-xs font-medium">{user.full_name}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {user.role}
                  </p>
                </div>
              </div>
              {messages.length === 0 && isAgent && (
                <Button
                  onClick={handleSeedDemoData}
                  variant="outline"
                  disabled={refreshing}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Load Demo Data
                </Button>
              )}
              <Button
                onClick={fetchData}
                variant="outline"
                size="icon"
                disabled={refreshing}
              >
                <RefreshCw
                  className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                />
              </Button>
              <Button
                onClick={logout}
                variant="ghost"
                size="icon"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="inbox" className="gap-2">
              <Inbox className="h-4 w-4" />
              Inbox
              {messages.filter((m) => m.status === "new").length > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                  {messages.filter((m) => m.status === "new").length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inbox">
            {messages.length === 0 ? (
              <Card className="p-12">
                <div className="text-center">
                  <Inbox className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
                  <h3 className="text-lg font-semibold mb-2">
                    No Messages Yet
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {isAgent
                      ? "Get started by loading some demo data to see how the AI analysis works"
                      : "No support messages to display at the moment"}
                  </p>
                  {isAgent && (
                    <Button onClick={handleSeedDemoData} disabled={refreshing}>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Load Demo Data
                    </Button>
                  )}
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-12 gap-4 h-[calc(100vh-200px)]">
                <Card className="col-span-12 md:col-span-4 lg:col-span-3 overflow-hidden min-w-0">
                  <MessageList
                    messages={messages}
                    selectedMessageId={selectedMessage?.id}
                    onSelectMessage={setSelectedMessage}
                  />
                </Card>

                {selectedMessage && (
                  <>
                    <Card className="col-span-12 md:col-span-8 lg:col-span-6 overflow-hidden min-w-0">
                      <MessageDetail
                        message={selectedMessage}
                        onStatusChange={handleStatusChange}
                      />
                    </Card>

                    <Card className="col-span-12 lg:col-span-3 overflow-auto hidden lg:block min-w-0">
                      <AIAnalysisPanel message={selectedMessage} />
                    </Card>
                  </>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="dashboard">
            {dashboardStats ? (
              <Dashboard stats={dashboardStats} />
            ) : (
              <Card className="p-8">
                <div className="text-center text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p>Loading dashboard...</p>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
