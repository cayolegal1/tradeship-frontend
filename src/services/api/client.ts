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
