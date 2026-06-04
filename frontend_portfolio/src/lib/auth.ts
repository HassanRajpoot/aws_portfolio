/**
 * Real authentication module — replaces the old mockAuth.ts.
 *
 * Stores session credentials in localStorage and exposes helpers
 * consumed by the Axios interceptor and route guards.
 */

import { apiClient } from "@/lib/apiClient";

const SESSION_ID_KEY = "devengine_session_id";
const REFRESH_TOKEN_KEY = "devengine_refresh_token";
const USER_KEY = "devengine_user";

export interface AuthUser {
  email: string;
}

export interface SignInResponse {
  session_id: string;
  expires_at: string;
  refresh_token: string;
  user: AuthUser;
}

// ---------------------------------------------------------------------------
// Credential storage
// ---------------------------------------------------------------------------

export function getSessionId(): string | null {
  return localStorage.getItem(SESSION_ID_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function isSignedIn(): boolean {
  return !!getSessionId() && !!getRefreshToken();
}

// ---------------------------------------------------------------------------
// Sign-in / sign-out
// ---------------------------------------------------------------------------

/**
 * Authenticate against the backend and persist the session.
 * Throws on failure so callers can display the error.
 */
export async function signIn(
  email: string,
  password: string,
): Promise<SignInResponse> {
  const { data } = await apiClient.post<SignInResponse>("/auth/sign-in/", {
    email,
    password,
  });

  localStorage.setItem(SESSION_ID_KEY, data.session_id);
  localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));

  return data;
}

/**
 * Revoke the session on the backend and clear local storage.
 */
export async function signOut(): Promise<void> {
  const sessionId = getSessionId();
  // Clear local storage synchronously first to prevent route race conditions
  clearSession();

  if (sessionId) {
    try {
      await apiClient.post("/auth/sign-out/");
    } catch {
      // Best-effort — local state is already cleared
    }
  }
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_ID_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
