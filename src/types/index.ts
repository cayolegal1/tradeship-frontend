import type { ReactNode } from "react";

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface Notification {
  id: number;
  link: string;
  message: string;
  type_name: string;
  marked_as_read: boolean;
  create_ts: string;
  partner?: string | null;
  trade?: string | null;
}

export interface UserSummary {
  id: number;
  username: string;
  avatar?: string | null;
  profile_pic?: string | null;
  location?: string | null;
  description?: string | null;
  create_ts?: string;
  last_activity_ts?: string;
}

export interface UserReview {
  id: number | string;
  from_profile_pic: string;
  title: string;
  create_ts: string;
  description: string;
  rating: number;
  would_trade_again: boolean;
  link?: string | null;
  linkText?: string | null;
}

export interface UserInterest {
  id: number | string;
  name: string;
  icon?: ReactNode;
}

export interface UserProfile extends UserSummary {
  averageRating?: number;
  tradeCount?: number;
  average_would_trade_again_percentage?: number;
  trustScore?: number;
  reviewsReceived: UserReview[];
  interests: UserInterest[];
  vault_trades_count?: number;
  quick_trades_count?: number;
  total_successful_trades?: number;
  dispute_count?: number;
  total_value?: number;
  average_price?: number;
}

export type ModalState = "deposit" | "withdraw" | null;

export interface WalletTransaction {
  id: number | string;
  transactionType: "deposit" | "withdraw" | "escrow" | "shipping" | "refund" | string;
  description: string;
  updatedAt: string;
  status: "completed" | "pending" | "failed" | string;
  amount: number;
}

export interface WalletAccount {
  id?: number | string;
  availableBalance: number;
  totalDeposited?: number;
  totalWithdrawn?: number;
  escrowBalance?: number;
  totalShippingPaid?: number;
  historyTransactions?: WalletTransaction[];
}

export interface NotificationFilterOption {
  id: string;
  label: string;
  value: string;
}
