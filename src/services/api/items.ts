import { apiClient } from './client';
import type { Item, PaginatedResponse } from '@/types';

export const itemsApi = {
  // Get all items with pagination and filtering
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    condition?: string;
    tradeType?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
  }): Promise<PaginatedResponse<Item>> => {
    const response = await apiClient.get('/api/trade/items', { params });
    return response.data;
  },

  // Get item by ID
  getById: async (id: number): Promise<Item> => {
    const response = await apiClient.get(`/api/trade/items/${id}`);
    return response.data;
  },

  // Get user's items
  getMyItems: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<PaginatedResponse<Item>> => {
    const response = await apiClient.get('/api/trade/items/my', { params });
    return response.data;
  },

  // Create new item
  create: async (data: FormData): Promise<Item> => {
    const response = await apiClient.post('/api/trade/items', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update item
  update: async (id: number, data: FormData): Promise<Item> => {
    const response = await apiClient.put(`/api/trade/items/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete item
  delete: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/api/trade/items/${id}`);
    return response.data;
  },

  // Favorite/unfavorite item
  toggleFavorite: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.post(`/api/trade/items/${id}/favorite`);
    return response.data;
  },

  // Upload item images
  uploadImages: async (itemId: number, images: File[]): Promise<{ message: string }> => {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append('images', image);
    });

    const response = await apiClient.post(
      `/api/trade/items/${itemId}/images`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },
};
