import { apiClient } from './client';
import type {
  TradeRequest,
  CreateTradeRequestDto,
  UpdateTradeRequestDto,
  RespondTradeRequestDto,
  TradeRequestStats,
  PaginatedResponse,
} from '@/types';

export const tradeRequestApi = {
  // Create a new trade request
  create: async (data: CreateTradeRequestDto): Promise<TradeRequest> => {
    const response = await apiClient.post('/api/trade-requests', data);
    return response.data;
  },

  // Get trade requests with pagination and filtering
  getAll: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    direction?: 'sent' | 'received';
    sortBy?: string;
  }): Promise<PaginatedResponse<TradeRequest>> => {
    const response = await apiClient.get('/api/trade-requests', { params });
    return response.data;
  },

  // Get sent trade requests
  getSent: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<PaginatedResponse<TradeRequest>> => {
    const response = await apiClient.get('/api/trade-requests/sent', { params });
    return response.data;
  },

  // Get received trade requests
  getReceived: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<PaginatedResponse<TradeRequest>> => {
    const response = await apiClient.get('/api/trade-requests/received', { params });
    return response.data;
  },

  // Get pending trade requests
  getPending: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<TradeRequest>> => {
    const response = await apiClient.get('/api/trade-requests/pending', { params });
    return response.data;
  },

  // Get trade request statistics
  getStats: async (): Promise<TradeRequestStats> => {
    const response = await apiClient.get('/api/trade-requests/stats');
    return response.data;
  },

  // Get trade request by ID
  getById: async (id: number): Promise<TradeRequest> => {
    const response = await apiClient.get(`/api/trade-requests/${id}`);
    return response.data;
  },

  // Update trade request
  update: async (id: number, data: UpdateTradeRequestDto): Promise<TradeRequest> => {
    const response = await apiClient.put(`/api/trade-requests/${id}`, data);
    return response.data;
  },

  // Respond to trade request (accept or decline)
  respond: async (id: number, data: RespondTradeRequestDto): Promise<{
    message: string;
    tradeId?: number;
  }> => {
    const response = await apiClient.post(`/api/trade-requests/${id}/respond`, data);
    return response.data;
  },

  // Accept trade request
  accept: async (id: number, message?: string): Promise<{
    message: string;
    tradeId: number;
  }> => {
    const response = await apiClient.post(`/api/trade-requests/${id}/accept`, {
      message,
    });
    return response.data;
  },

  // Decline trade request
  decline: async (id: number, message?: string): Promise<{
    message: string;
  }> => {
    const response = await apiClient.post(`/api/trade-requests/${id}/decline`, {
      message,
    });
    return response.data;
  },

  // Cancel trade request
  cancel: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/api/trade-requests/${id}`);
    return response.data;
  },
};
