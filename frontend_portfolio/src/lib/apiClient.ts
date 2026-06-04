import axios from "axios";
import { getSessionId, getRefreshToken, clearSession } from "@/lib/auth";

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
