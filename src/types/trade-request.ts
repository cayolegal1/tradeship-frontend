export interface TradeRequestUser {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

export interface TradeRequestItem {
  id: number;
  name: string;
  description: string;
  price: number;
  primaryImage?: string;
  owner: TradeRequestUser;
}

export interface TradeRequest {
  id: number;
  status: "PENDING" | "ACCEPTED" | "DECLINED" | "EXPIRED" | "CANCELLED";
  cashAmount?: number;
  message?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
  respondedAt?: string;
  requester: TradeRequestUser;
  recipient: TradeRequestUser;
  requestedItem: TradeRequestItem;
  proposedItem?: TradeRequestItem;
  tradeId?: number;
}

export interface CreateTradeRequestDto {
  recipientId: number;
  requestedItemId: number;
  proposedItemId?: number;
  cashAmount?: number;
  message?: string;
  expiresAt?: string;
}

export interface UpdateTradeRequestDto {
  proposedItemId?: number;
  cashAmount?: number;
  message?: string;
  expiresAt?: string;
}

export interface RespondTradeRequestDto {
  message?: string;
}

export interface GetTradeRequestsDto {
  page?: number;
  limit?: number;
  status?: string;
  direction?: "sent" | "received" | "all";
  sortBy?: string;
}

export interface TradeRequestStats {
  totalSent: number;
  totalReceived: number;
  pendingSent: number;
  pendingReceived: number;
  acceptedSent: number;
  acceptedReceived: number;
  declinedSent: number;
  declinedReceived: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Helper type to determine if user can take action on a trade request
export type TradeRequestActionType =
  | "accept" // User can accept (received + pending)
  | "decline" // User can decline (received + pending)
  | "cancel" // User can cancel (sent + pending)
  | "view" // User can only view (sent + accepted/declined/expired)
  | "none"; // No actions available

export interface TradeRequestWithActions extends TradeRequest {
  actionType: TradeRequestActionType;
  isFromCurrentUser: boolean;
}
