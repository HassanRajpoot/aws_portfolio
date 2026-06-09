import axios from "axios";
import { getSessionId, getRefreshToken, clearSession } from "@/lib/auth";

// API base URL is injected at build time via VITE_API_URL env var (set in GitHub Variables)
// In production: /api/v1 (relative → CloudFront routes to EC2)
// In development: http://127.0.0.1:8000/api/v1 (local Django server)
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// ---------------------------------------------------------------------------
// Request interceptor — inject auth headers when signed in
// ---------------------------------------------------------------------------
apiClient.interceptors.request.use((config) => {
  const sessionId = getSessionId();
  const refreshToken = getRefreshToken();

  if (sessionId && refreshToken) {
    config.headers["X-Session-Id"] = sessionId;
    config.headers["Authorization"] = `Bearer ${refreshToken}`;
  }

  return config;
});

// ---------------------------------------------------------------------------
// Response interceptor — redirect to sign-in on 401
// ---------------------------------------------------------------------------
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearSession();
      // Only redirect if we're on an admin page (don't redirect public pages)
      if (window.location.pathname.startsWith("/admin")) {
        window.location.href = "/admin/sign-in";
      }
    }
    return Promise.reject(error);
  },
);
