export interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  tradeType: "SELL" | "TRADE" | "BOTH";
  isActive: boolean;
  isAvailableForTrade: boolean;
  primaryImage?: string;
  images?: string[];
  ownerId: number;
  owner: {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface GetItemsDto {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  trade_type?: "SELL" | "TRADE" | "BOTH";
  order_by?: string;
  sort?: "asc" | "desc";
}

export interface CreateItemDto {
  name: string;
  description: string;
  price: number;
  category: string;
  tradeType: "SELL" | "TRADE" | "BOTH";
  images?: File[];
}

export interface UpdateItemDto {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  tradeType?: "SELL" | "TRADE" | "BOTH";
  isActive?: boolean;
  isAvailableForTrade?: boolean;
  images?: File[];
}
