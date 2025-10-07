import { AxiosResponse } from "axios";
import { apiClient } from "@/services/api/client";

export abstract class BaseRepository {
  protected static async get<T>(
    baseURL: string,
    url: string,
    params?: Record<string, unknown>
  ): Promise<T> {
    const response: AxiosResponse<T> = await apiClient.get(`${baseURL}${url}`, {
      params,
    });
    return response.data;
  }

  protected static async post<T>(
    baseURL: string,
    url: string,
    data?: unknown
  ): Promise<T> {
    const response: AxiosResponse<T> = await apiClient.post(
      `${baseURL}${url}`,
      data
    );
    return response.data;
  }

  protected static async put<T>(
    baseURL: string,
    url: string,
    data?: unknown
  ): Promise<T> {
    const response: AxiosResponse<T> = await apiClient.put(
      `${baseURL}${url}`,
      data
    );
    return response.data;
  }

  protected static async delete<T>(baseURL: string, url: string): Promise<T> {
    const response: AxiosResponse<T> = await apiClient.delete(
      `${baseURL}${url}`
    );
    return response.data;
  }
}
