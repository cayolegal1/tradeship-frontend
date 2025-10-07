import { useState, useEffect, useCallback } from "react";
import { ChatRepository } from "@/repositories";
import { ChatConversation, PaginatedResponse } from "@/types";

interface UseConversationsOptions {
  autoLoad?: boolean;
  pageSize?: number;
}

interface UseConversationsReturn {
  // State
  conversations: ChatConversation[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  error: string | null;

  // Actions
  loadConversations: (page?: number, reset?: boolean) => Promise<void>;
  refreshConversations: () => Promise<void>;
  createConversation: (
    participantIds: number[],
    options?: {
      title?: string;
      description?: string;
      isPrivate?: boolean;
      contentType?: string;
      objectId?: string;
    }
  ) => Promise<ChatConversation>;
  createTradeConversation: (
    recipientId: number,
    tradeRequestId?: number
  ) => Promise<ChatConversation>;

  // Utilities
  clearError: () => void;
  getConversationById: (id: number) => ChatConversation | undefined;
}

export const useConversations = (
  options: UseConversationsOptions = {}
): UseConversationsReturn => {
  const { autoLoad = true, pageSize = 20 } = options;

  // State
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load conversations
  const loadConversations = useCallback(
    async (page: number = 1, reset: boolean = false) => {
      try {
        if (page === 1) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }
        setError(null);

        const response: PaginatedResponse<ChatConversation> =
          await ChatRepository.getConversations({
            page,
            limit: pageSize,
          });

        if (reset || page === 1) {
          setConversations(response.results);
        } else {
          setConversations((prev) => [...prev, ...response.results]);
        }

        setHasMore(response.results.length === pageSize);
        setCurrentPage(page);
      } catch (err) {
        setError("Failed to load conversations");
        console.error("Error loading conversations:", err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [pageSize]
  );

  // Refresh conversations
  const refreshConversations = useCallback(async () => {
    await loadConversations(1, true);
  }, [loadConversations]);

  // Create conversation
  const createConversation = useCallback(
    async (
      participantIds: number[],
      options?: {
        title?: string;
        description?: string;
        isPrivate?: boolean;
        contentType?: string;
        objectId?: string;
      }
    ): Promise<ChatConversation> => {
      try {
        setError(null);

        const newConversation = await ChatRepository.createConversation({
          participantIds,
          ...options,
        });

        // Add to the beginning of the list
        setConversations((prev) => [newConversation, ...prev]);

        return newConversation;
      } catch (err) {
        setError("Failed to create conversation");
        console.error("Error creating conversation:", err);
        throw err;
      }
    },
    []
  );

  // Create trade conversation
  const createTradeConversation = useCallback(
    async (
      recipientId: number,
      tradeRequestId?: number
    ): Promise<ChatConversation> => {
      try {
        setError(null);

        const newConversation = await ChatRepository.createTradeConversation({
          recipientId,
          tradeRequestId,
        });

        // Check if conversation already exists
        const existingIndex = conversations.findIndex(
          (c) => c.id === newConversation.id
        );
        if (existingIndex >= 0) {
          // Update existing conversation
          setConversations((prev) =>
            prev.map((conv, index) =>
              index === existingIndex ? newConversation : conv
            )
          );
        } else {
          // Add new conversation to the beginning
          setConversations((prev) => [newConversation, ...prev]);
        }

        return newConversation;
      } catch (err) {
        setError("Failed to create trade conversation");
        console.error("Error creating trade conversation:", err);
        throw err;
      }
    },
    [conversations]
  );

  // Get conversation by ID
  const getConversationById = useCallback(
    (id: number): ChatConversation | undefined => {
      return conversations.find((conv) => conv.id === id);
    },
    [conversations]
  );

  // Auto-load conversations
  useEffect(() => {
    if (autoLoad) {
      loadConversations(1, true);
    }
  }, [autoLoad, loadConversations]);

  return {
    // State
    conversations,
    loading,
    loadingMore,
    hasMore,
    error,

    // Actions
    loadConversations,
    refreshConversations,
    createConversation,
    createTradeConversation,

    // Utilities
    clearError,
    getConversationById,
  };
};
