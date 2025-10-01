import axios from "axios";

import { SERVER_URL } from "@/config";

export const apiClient = axios.create({
  baseURL: SERVER_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];  

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});