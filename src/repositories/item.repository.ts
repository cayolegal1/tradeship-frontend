import { BaseRepository } from "./base.repository";
import {
  Item,
  PaginatedResponse,
  GetItemsDto,
  CreateItemDto,
  UpdateItemDto,
} from "@/types";

export class ItemRepository extends BaseRepository {
  private static readonly BASE_URL = "/api/trade";

  // Get item by ID
  static async getItemById(id: number): Promise<Item> {
    return this.get<Item>(this.BASE_URL, `/items/${id}`);
  }

  // Get items with pagination and filters
  static async getItems(
    params?: GetItemsDto
  ): Promise<PaginatedResponse<Item>> {
    return this.get<PaginatedResponse<Item>>(this.BASE_URL, "/items", params);
  }

  // Get user's items
  static async getUserItems(
    params?: GetItemsDto
  ): Promise<PaginatedResponse<Item>> {
    return this.get<PaginatedResponse<Item>>(
      this.BASE_URL,
      "/items/my",
      params
    );
  }

  // Favorite an item
  static async favoriteItem(id: number): Promise<{ message: string }> {
    return this.post<{ message: string }>(
      this.BASE_URL,
      `/items/${id}/favorite`
    );
  }

  // Create a new item
  static async createItem(data: CreateItemDto): Promise<Item> {
    return this.post<Item>(this.BASE_URL, "/items", data);
  }

  // Update an item
  static async updateItem(id: number, data: UpdateItemDto): Promise<Item> {
    return this.put<Item>(this.BASE_URL, `/items/${id}`, data);
  }

  // Delete an item
  static async deleteItem(id: number): Promise<void> {
    return this.delete<void>(this.BASE_URL, `/items/${id}`);
  }
}
