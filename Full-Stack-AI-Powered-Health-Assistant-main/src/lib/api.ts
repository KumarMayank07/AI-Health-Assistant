const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

class ApiService {
  private baseURL: string;
  private token: string | null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem("token"); // initialize from storage
  }

  private getHeaders(extra: HeadersInit = {}): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...extra,
    };
    const currentToken = this.token || localStorage.getItem("token");
    if (currentToken) {
      headers["Authorization"] = `Bearer ${currentToken}`;
    }
    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: this.getHeaders(options.headers || {}),
    };

    const response = await fetch(url, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }
    return response.json();
  }

  // Authentication methods

  async login(email: string, password: string) {
    const response = await this.request<{
      token: string;
      user: any;
      message: string;
    }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    this.setToken(response.token);
    localStorage.setItem("user", JSON.stringify(response.user));

    return response;
  }

  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    dateOfBirth?: string;
    gender?: string;
  }) {
    const response = await this.request<{
      token: string;
      user: any;
      message: string;
    }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });

    this.setToken(response.token);
    localStorage.setItem("user", JSON.stringify(response.user));

    return response;
  }

  async adminLogin(email: string, password: string) {
    const response = await this.request<{
      token: string;
      user: any;
      message: string;
    }>("/auth/admin-login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    this.setToken(response.token);
    localStorage.setItem("user", JSON.stringify(response.user));

    return response;
  }

  async logout() {
    try {
      await this.request("/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      this.clearToken();
      localStorage.removeItem("user");
    }
  }

  async getCurrentUser() {
    return await this.request<{ user: any }>("/auth/me");
  }

  // User profile methods

  async updateProfile(profileData: any) {
    return await this.request<{ user: any; message: string }>(
      "/users/profile",
      {
        method: "PUT",
        body: JSON.stringify(profileData),
      }
    );
  }

  async updateMedicalHistory(medicalHistory: any) {
    return await this.request<{ user: any; message: string }>(
      "/users/medical-history",
      {
        method: "PUT",
        body: JSON.stringify({ medicalHistory }),
      }
    );
  }

  async updateEyeData(eyeData: any) {
    return await this.request<{ user: any; message: string }>(
      "/users/eye-data",
      {
        method: "PUT",
        body: JSON.stringify({ eyeData }),
      }
    );
  }

  // Doctor methods

  async getNearbyDoctors(
    lat: number,
    lng: number,
    maxDistance = 50,
    specialization?: string
  ) {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lng: lng.toString(),
      maxDistance: maxDistance.toString(),
    });
    if (specialization) params.append("specialization", specialization);

    return await this.request<{ doctors: any[]; count: number }>(
      `/doctors/nearby?${params}`
    );
  }

  async getAllDoctors(
    filters: {
      specialization?: string;
      city?: string;
      rating?: number;
      limit?: number;
      page?: number;
    } = {}
  ) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) params.append(key, value.toString());
    });

    return await this.request<{ doctors: any[]; pagination: any }>(
      `/doctors?${params}`
    );
  }

  async getDoctorById(id: string) {
    return await this.request<{ doctor: any }>(`/doctors/${id}`);
  }

  async createDoctorProfile(doctorData: any) {
    return await this.request<{ doctor: any; message: string }>("/doctors", {
      method: "POST",
      body: JSON.stringify(doctorData),
    });
  }

  async addDoctorReview(
    doctorId: string,
    review: { rating: number; comment?: string }
  ) {
    return await this.request<{ doctor: any; message: string }>(
      `/doctors/${doctorId}/reviews`,
      {
        method: "POST",
        body: JSON.stringify(review),
      }
    );
  }

  // Chat/AI methods

  async askAI(message: string, context?: string) {
    return await this.request<{ response: string; timestamp: string }>(
      "/chat/ask",
      {
        method: "POST",
        body: JSON.stringify({ message, context }),
      }
    );
  }

  async analyzeSymptoms(
    symptoms: string[],
    duration?: string,
    severity?: string
  ) {
    return await this.request<{
      analysis: string;
      timestamp: string;
      disclaimer: string;
    }>("/chat/symptoms", {
      method: "POST",
      body: JSON.stringify({ symptoms, duration, severity }),
    });
  }

  async getEducationalContent(topic: string, level = "basic") {
    return await this.request<{
      content: string;
      topic: string;
      level: string;
      timestamp: string;
    }>("/chat/education", {
      method: "POST",
      body: JSON.stringify({ topic, level }),
    });
  }

  // Upload methods

  async uploadImage(file: File) {
    const formData = new FormData();
    formData.append("image", file);

    const url = `${this.baseURL}/upload/image`;
    const response = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${this.token || ""}` },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }
    return await response.json();
  }

  async uploadProfileImage(file: File) {
    const formData = new FormData();
    formData.append("image", file);

    const url = `${this.baseURL}/upload/profile-image`;
    const response = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${this.token || ""}` },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }
    return await response.json();
  }

  // Utility methods

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token || localStorage.getItem("token");
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem("token", token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem("token");
  }

  // RAG Chat methods

  async ragSendMessage(message: string, chatId?: string) {
    const ragUrl =
      import.meta.env.VITE_RAG_API_BASE_URL || "http://localhost:8502/api/rag";
    const clientTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const response = await fetch(`${ragUrl}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          this.token || localStorage.getItem("token") || ""
        }`,
      },
      body: JSON.stringify({
        message,
        chat_id: chatId,
        top_k: 5,
        timezone: clientTimezone,
      }),
    });

    if (!response.ok) throw new Error(`RAG chat failed: ${response.status}`);
    return response.json();
  }

  async ragGetChats() {
    const ragUrl =
      import.meta.env.VITE_RAG_API_BASE_URL || "http://localhost:8502/api/rag";
    const response = await fetch(`${ragUrl}/chats`, {
      headers: {
        Authorization: `Bearer ${
          this.token || localStorage.getItem("token") || ""
        }`,
      },
    });

    if (!response.ok) throw new Error(`Get chats failed: ${response.status}`);
    return response.json();
  }

  async ragGetMessages(chatId: string) {
    const ragUrl =
      import.meta.env.VITE_RAG_API_BASE_URL || "http://localhost:8502/api/rag";
    const response = await fetch(`${ragUrl}/chats/${chatId}/messages`, {
      headers: {
        Authorization: `Bearer ${
          this.token || localStorage.getItem("token") || ""
        }`,
      },
    });

    if (!response.ok)
      throw new Error(`Get messages failed: ${response.status}`);
    return response.json();
  }

  // --- Added rag chat helpers ---

  async ragDeleteChat(chatId: string) {
    const ragUrl =
      import.meta.env.VITE_RAG_API_BASE_URL || "http://localhost:8502/api/rag";
    const response = await fetch(
      `${ragUrl}/chats/${encodeURIComponent(chatId)}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            this.token || localStorage.getItem("token") || ""
          }`,
        },
      }
    );

    if (!response.ok) throw new Error(`Delete chat failed: ${response.status}`);
    return response.json();
  }

  async ragRenameChat(chatId: string, newTitle: string) {
    const ragUrl =
      import.meta.env.VITE_RAG_API_BASE_URL || "http://localhost:8502/api/rag";
    const response = await fetch(
      `${ragUrl}/chats/${encodeURIComponent(chatId)}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            this.token || localStorage.getItem("token") || ""
          }`,
        },
        body: JSON.stringify({ title: newTitle }),
      }
    );

    if (!response.ok) throw new Error(`Rename chat failed: ${response.status}`);
    return response.json();
  }

  async ragArchiveChat(chatId: string, archived = true) {
    const ragUrl =
      import.meta.env.VITE_RAG_API_BASE_URL || "http://localhost:8502/api/rag";
    const response = await fetch(
      `${ragUrl}/chats/${encodeURIComponent(chatId)}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            this.token || localStorage.getItem("token") || ""
          }`,
        },
        body: JSON.stringify({ archived }),
      }
    );

    if (!response.ok)
      throw new Error(`Archive toggle failed: ${response.status}`);
    return response.json();
  }

  async ragShareChat(chatId: string) {
    const ragUrl =
      import.meta.env.VITE_RAG_API_BASE_URL || "http://localhost:8502/api/rag";
    const response = await fetch(
      `${ragUrl}/chats/${encodeURIComponent(chatId)}/share`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            this.token || localStorage.getItem("token") || ""
          }`,
        },
      }
    );

    if (!response.ok) throw new Error(`Share chat failed: ${response.status}`);
    return response.json();
  }
}

export const apiService = new ApiService();
export default apiService;
