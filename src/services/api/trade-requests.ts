import { TradeRequestRepository } from "@/repositories";
import {
  TradeRequest,
  CreateTradeRequestDto,
  UpdateTradeRequestDto,
  RespondTradeRequestDto,
  GetTradeRequestsDto,
  TradeRequestStats,
  PaginatedResponse,
} from "@/types/trade-request";

export const tradeRequestApi = {
  // Get all trade requests (with optional filtering)
  getTradeRequests: (params?: GetTradeRequestsDto) =>
    TradeRequestRepository.getTradeRequests(params),

  // Get trade requests sent by the current user
  getSentTradeRequests: (params?: Omit<GetTradeRequestsDto, "direction">) =>
    TradeRequestRepository.getSentTradeRequests(params),

  // Get trade requests received by the current user
  getReceivedTradeRequests: (params?: Omit<GetTradeRequestsDto, "direction">) =>
    TradeRequestRepository.getReceivedTradeRequests(params),

  // Get pending trade requests received by the current user
  getPendingTradeRequests: (
    params?: Omit<GetTradeRequestsDto, "direction" | "status">
  ) => TradeRequestRepository.getPendingTradeRequests(params),

  // Get a specific trade request by ID
  getTradeRequestById: (id: number) =>
    TradeRequestRepository.getTradeRequestById(id),

  // Create a new trade request
  createTradeRequest: (data: CreateTradeRequestDto) =>
    TradeRequestRepository.createTradeRequest(data),

  // Update a trade request (only for sent requests)
  updateTradeRequest: (id: number, data: UpdateTradeRequestDto) =>
    TradeRequestRepository.updateTradeRequest(id, data),

  // Respond to a trade request (accept/decline)
  respondToTradeRequest: (id: number, data: RespondTradeRequestDto) =>
    TradeRequestRepository.respondToTradeRequest(id, data),

  // Accept a trade request
  acceptTradeRequest: (id: number, message?: string) =>
    TradeRequestRepository.acceptTradeRequest(id, message),

  // Decline a trade request
  declineTradeRequest: (id: number, message?: string) =>
    TradeRequestRepository.declineTradeRequest(id, message),

  // Cancel a trade request (only for sent requests)
  cancelTradeRequest: (id: number) =>
    TradeRequestRepository.cancelTradeRequest(id),

  // Get trade request statistics
  getTradeRequestStats: () => TradeRequestRepository.getTradeRequestStats(),
};
