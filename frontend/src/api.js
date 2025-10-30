import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE || "http://localhost:5000";

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


