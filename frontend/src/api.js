import axios from "axios";

// Resolve API base URL from env or runtime injection.
// Priority: REACT_APP_API_BASE > window.__API_BASE__ > localhost (dev)
const envBase = (process.env.REACT_APP_API_BASE || "").trim();
// eslint-disable-next-line no-undef
const runtimeBase = typeof window !== "undefined" && window.__API_BASE__ ? String(window.__API_BASE__).trim() : "";
const DEFAULT_DEV_BASE = "http://localhost:5000";
const BASE_URL = envBase || runtimeBase || DEFAULT_DEV_BASE;

if (process.env.NODE_ENV === "production" && BASE_URL.includes("localhost")) {
  // Surface a clear error in production if API base isn't configured.
  // This helps catch misconfigurations on Vercel/Render.
  // eslint-disable-next-line no-console
  console.error(
    "API base URL is not configured for production. Set REACT_APP_API_BASE or window.__API_BASE__ to your backend URL. Current base:",
    BASE_URL
  );
}

export const api = axios.create({ baseURL: BASE_URL });

export function setAuth(token, user) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

export function getToken() {
  return localStorage.getItem("token");
}

export function getUser() {
  const raw = localStorage.getItem("user");
  try { return raw ? JSON.parse(raw) : null; } catch { return null; }
}

export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}


