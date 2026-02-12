const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface Message {
  id: number;
  customer_name: string;
  customer_email: string;
  subject: string;
  content: string;
  status: "new" | "in_progress" | "resolved" | "closed";
  category:
    | "billing"
    | "technical"
    | "feature_request"
    | "account"
    | "general"
    | null;
  sentiment: "positive" | "neutral" | "negative" | "very_negative" | null;
  sentiment_score: number | null;
  summary: string | null;
  suggested_response: string | null;
  created_at: string;
  updated_at: string;
}

export interface MessageCreate {
  customer_name: string;
  customer_email: string;
  subject: string;
  content: string;
}

export interface DashboardStats {
  total_messages: number;
  new_messages: number;
  in_progress: number;
  resolved: number;
  sentiment_stats: {
    positive: number;
    neutral: number;
    negative: number;
    very_negative: number;
    total: number;
  };
  category_stats: {
    billing: number;
    technical: number;
    feature_request: number;
    account: number;
    general: number;
  };
  avg_sentiment_score: number;
}

export interface User {
  id: number;
  email: string;
  username: string;
  full_name: string;
  role: "customer" | "agent" | "admin";
  is_active: boolean;
  created_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  full_name: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

class APIClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token");
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("auth_token", token);
      } else {
        localStorage.removeItem("auth_token");
      }
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit,
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options?.headers as Record<string, string>),
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ detail: "Unknown error" }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    this.setToken(response.access_token);
    return response;
  }

  async register(data: RegisterData): Promise<User> {
    return this.request<User>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>("/api/auth/me");
  }

  logout() {
    this.setToken(null);
  }

  async getMessages(filters?: {
    status?: string;
    category?: string;
    sentiment?: string;
    limit?: number;
  }): Promise<Message[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.set("status", filters.status);
    if (filters?.category) params.set("category", filters.category);
    if (filters?.sentiment) params.set("sentiment", filters.sentiment);
    if (filters?.limit) params.set("limit", filters.limit.toString());

    const query = params.toString() ? `?${params.toString()}` : "";
    return this.request<Message[]>(`/api/messages${query}`);
  }

  async getMessage(id: number): Promise<Message> {
    return this.request<Message>(`/api/messages/${id}`);
  }

  async createMessage(data: MessageCreate): Promise<Message> {
    return this.request<Message>("/api/messages", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateMessageStatus(
    id: number,
    status: Message["status"],
  ): Promise<Message> {
    return this.request<Message>(`/api/messages/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  async reanalyzeMessage(id: number): Promise<any> {
    return this.request(`/api/messages/${id}/reanalyze`, {
      method: "POST",
    });
  }

  async deleteMessage(id: number): Promise<void> {
    await this.request(`/api/messages/${id}`, {
      method: "DELETE",
    });
  }

  async getDashboardStats(): Promise<DashboardStats> {
    return this.request<DashboardStats>("/api/analytics/dashboard");
  }

  async seedDemoData(): Promise<any> {
    return this.request("/api/seed-demo-data", {
      method: "POST",
    });
  }
}

export const api = new APIClient();
