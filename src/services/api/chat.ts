import { ChatRepository } from "@/repositories";
import type {
  ChatConversation,
  ChatMessage,
  CreateConversationDto,
  SendMessageDto,
  PaginatedResponse,
} from "@/types";

export const chatApi = {
  // Create a new conversation
  createConversation: async (
    data: CreateConversationDto
  ): Promise<ChatConversation> => {
    return ChatRepository.createConversation(data);
  },

  // Get user conversations with pagination
  getConversations: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<ChatConversation>> => {
    return ChatRepository.getConversations(params);
  },

  // Get conversation by ID
  getConversationById: async (id: number): Promise<ChatConversation> => {
    return ChatRepository.getConversationById(id);
  },

  // Send a message to a conversation
  sendMessage: async (
    conversationId: number,
    data: SendMessageDto
  ): Promise<ChatMessage> => {
    return ChatRepository.sendMessage(conversationId, data);
  },

  // Get conversation messages with pagination
  getMessages: async (
    conversationId: number,
    params?: {
      page?: number;
      limit?: number;
    }
  ): Promise<PaginatedResponse<ChatMessage>> => {
    return ChatRepository.getMessages(conversationId, params);
  },

  // Mark messages as read
  markAsRead: async (conversationId: number): Promise<{ message: string }> => {
    return ChatRepository.markAsRead(conversationId);
  },

  // Create or get trade conversation
  createTradeConversation: async (data: {
    recipientId: number;
    tradeRequestId?: number;
  }): Promise<ChatConversation> => {
    return ChatRepository.createTradeConversation(data);
  },
};
