import type { InternalAxiosRequestConfig } from "axios";
import axios from "axios";

import { SERVER_URL } from "@/config";

export const TOKEN_STORAGE_KEY = "token";

const getCookieValue = (name: string): string | null => {
  if (typeof document === "undefined") {
    return null;
  }

  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));

  return cookie ? cookie.split("=")[1] : null;
};

export const apiClient = axios.create({
  baseURL: SERVER_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window === "undefined") {
    return config;
  }

  const token =
    window.localStorage.getItem(TOKEN_STORAGE_KEY) ??
    getCookieValue(TOKEN_STORAGE_KEY);

  if (token) {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  return config;
});
