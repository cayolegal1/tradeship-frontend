/* import axios from "axios";

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
}); */

import axios, { AxiosHeaders } from "axios";
import { SERVER_URL } from "@/config";

export const apiClient = axios.create({
  baseURL: SERVER_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  if (!config.headers || !(config.headers instanceof AxiosHeaders)) {
    config.headers = new AxiosHeaders(config.headers);
  }
  const headers = config.headers as AxiosHeaders;

  // Auth
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const isFormData =
    typeof FormData !== "undefined" && config.data instanceof FormData;

  if (isFormData) {
    headers.delete("Content-Type");
  } else {
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
  }

  return config;
});
