import { BaseRepository } from "./base.repository";
import {
  ChatConversation,
  ChatMessage,
  CreateConversationDto,
  SendMessageDto,
  PaginatedResponse,
} from "@/types/chat";

export class ChatRepository extends BaseRepository {
  private static readonly BASE_URL = "/api/chat";

  // Create a new conversation
  static async createConversation(
    data: CreateConversationDto
  ): Promise<ChatConversation> {
    return this.post<ChatConversation>(this.BASE_URL, "/conversations", data);
  }

  // Get user conversations with pagination
  static async getConversations(params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<ChatConversation>> {
    return this.get<PaginatedResponse<ChatConversation>>(
      this.BASE_URL,
      "/conversations",
      params
    );
  }

  // Get conversation by ID
  static async getConversationById(id: number): Promise<ChatConversation> {
    return this.get<ChatConversation>(this.BASE_URL, `/conversations/${id}`);
  }

  // Send a message to a conversation
  static async sendMessage(
    conversationId: number,
    data: SendMessageDto
  ): Promise<ChatMessage> {
    return this.post<ChatMessage>(
      this.BASE_URL,
      `/conversations/${conversationId}/messages`,
      data
    );
  }

  // Get conversation messages with pagination
  static async getMessages(
    conversationId: number,
    params?: {
      page?: number;
      limit?: number;
    }
  ): Promise<PaginatedResponse<ChatMessage>> {
    return this.get<PaginatedResponse<ChatMessage>>(
      this.BASE_URL,
      `/conversations/${conversationId}/messages`,
      params
    );
  }

  // Mark messages as read
  static async markAsRead(
    conversationId: number
  ): Promise<{ message: string }> {
    return this.put<{ message: string }>(
      this.BASE_URL,
      `/conversations/${conversationId}/read`
    );
  }

  // Create or get trade conversation
  static async createTradeConversation(data: {
    recipientId: number;
    tradeRequestId?: number;
  }): Promise<ChatConversation> {
    return this.post<ChatConversation>(
      this.BASE_URL,
      "/trade-conversation",
      data
    );
  }
}
