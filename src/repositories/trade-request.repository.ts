import { BaseRepository } from "./base.repository";
import {
  TradeRequest,
  CreateTradeRequestDto,
  UpdateTradeRequestDto,
  RespondTradeRequestDto,
  GetTradeRequestsDto,
  TradeRequestStats,
  PaginatedResponse,
} from "@/types/trade-request";

export class TradeRequestRepository extends BaseRepository {
  private static readonly BASE_URL = "/api/trade-requests";

  // Get all trade requests (with optional filtering)
  static async getTradeRequests(
    params?: GetTradeRequestsDto
  ): Promise<PaginatedResponse<TradeRequest>> {
    return this.get<PaginatedResponse<TradeRequest>>(
      this.BASE_URL,
      "/",
      params
    );
  }

  // Get trade requests sent by the current user
  static async getSentTradeRequests(
    params?: Omit<GetTradeRequestsDto, "direction">
  ): Promise<PaginatedResponse<TradeRequest>> {
    return this.get<PaginatedResponse<TradeRequest>>(
      this.BASE_URL,
      "/sent",
      params
    );
  }

  // Get trade requests received by the current user
  static async getReceivedTradeRequests(
    params?: Omit<GetTradeRequestsDto, "direction">
  ): Promise<PaginatedResponse<TradeRequest>> {
    return this.get<PaginatedResponse<TradeRequest>>(
      this.BASE_URL,
      "/received",
      params
    );
  }

  // Get pending trade requests received by the current user
  static async getPendingTradeRequests(
    params?: Omit<GetTradeRequestsDto, "direction" | "status">
  ): Promise<PaginatedResponse<TradeRequest>> {
    return this.get<PaginatedResponse<TradeRequest>>(
      this.BASE_URL,
      "/pending",
      params
    );
  }

  // Get a specific trade request by ID
  static async getTradeRequestById(id: number): Promise<TradeRequest> {
    return this.get<TradeRequest>(this.BASE_URL, `/${id}`);
  }

  // Create a new trade request
  static async createTradeRequest(
    data: CreateTradeRequestDto
  ): Promise<TradeRequest> {
    return this.post<TradeRequest>(this.BASE_URL, "/", data);
  }

  // Update a trade request (only for sent requests)
  static async updateTradeRequest(
    id: number,
    data: UpdateTradeRequestDto
  ): Promise<TradeRequest> {
    return this.put<TradeRequest>(this.BASE_URL, `/${id}`, data);
  }

  // Respond to a trade request (accept/decline)
  static async respondToTradeRequest(
    id: number,
    data: RespondTradeRequestDto
  ): Promise<TradeRequest> {
    return this.post<TradeRequest>(this.BASE_URL, `/${id}/respond`, data);
  }

  // Accept a trade request
  static async acceptTradeRequest(
    id: number,
    message?: string
  ): Promise<TradeRequest> {
    return this.post<TradeRequest>(this.BASE_URL, `/${id}/accept`, { message });
  }

  // Decline a trade request
  static async declineTradeRequest(
    id: number,
    message?: string
  ): Promise<TradeRequest> {
    return this.post<TradeRequest>(this.BASE_URL, `/${id}/decline`, {
      message,
    });
  }

  // Cancel a trade request (only for sent requests)
  static async cancelTradeRequest(id: number): Promise<void> {
    return this.delete<void>(this.BASE_URL, `/${id}`);
  }

  // Get trade request statistics
  static async getTradeRequestStats(): Promise<TradeRequestStats> {
    return this.get<TradeRequestStats>(this.BASE_URL, "/stats");
  }
}
