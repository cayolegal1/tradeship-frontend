import { useState, useEffect, useCallback, useRef } from "react";
import { ChatRepository } from "@/repositories";
import { ChatConversation, ChatMessage, PaginatedResponse } from "@/types";

interface UseChatOptions {
  conversationId?: number;
  autoLoad?: boolean;
  pageSize?: number;
}

interface UseChatReturn {
  // State
  conversation: ChatConversation | null;
  messages: ChatMessage[];
  loading: boolean;
  loadingMore: boolean;
  sending: boolean;
  hasMore: boolean;
  error: string | null;

  // Actions
  loadConversation: (id: number) => Promise<void>;
  loadMessages: (page?: number, reset?: boolean) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  markAsRead: () => Promise<void>;
  refreshConversation: () => Promise<void>;

  // Utilities
  clearError: () => void;
}

export const useChat = (options: UseChatOptions = {}): UseChatReturn => {
  const { conversationId, autoLoad = true, pageSize = 50 } = options;

  // State
  const [conversation, setConversation] = useState<ChatConversation | null>(
    null
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [sending, setSending] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Refs
  const abortControllerRef = useRef<AbortController | null>(null);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load conversation
  const loadConversation = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      const conversationData = await ChatRepository.getConversationById(id);
      setConversation(conversationData);
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        setError("Failed to load conversation");
        console.error("Error loading conversation:", err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Load messages
  const loadMessages = useCallback(
    async (page: number = 1, reset: boolean = false) => {
      if (!conversation?.id) return;

      try {
        if (page === 1) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }
        setError(null);

        const response: PaginatedResponse<ChatMessage> =
          await ChatRepository.getMessages(conversation.id, {
            page,
            limit: pageSize,
          });

        if (reset || page === 1) {
          setMessages(response.results.reverse()); // Reverse to show oldest first
        } else {
          setMessages((prev) => [...response.results.reverse(), ...prev]);
        }

        setHasMore(response.results.length === pageSize);
        setCurrentPage(page);
      } catch (err) {
        setError("Failed to load messages");
        console.error("Error loading messages:", err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [conversation?.id, pageSize]
  );

  // Send message
  const sendMessage = useCallback(
    async (content: string) => {
      if (!conversation?.id || !content.trim() || sending) return;

      try {
        setSending(true);
        setError(null);

        const newMessage = await ChatRepository.sendMessage(conversation.id, {
          content: content.trim(),
        });

        setMessages((prev) => [...prev, newMessage]);

        // Update conversation's last message
        if (conversation) {
          setConversation((prev) =>
            prev
              ? {
                  ...prev,
                  lastMessage: newMessage,
                  lastMessageAt: newMessage.createdAt,
                  updatedAt: newMessage.createdAt,
                }
              : null
          );
        }
      } catch (err) {
        setError("Failed to send message");
        console.error("Error sending message:", err);
      } finally {
        setSending(false);
      }
    },
    [conversation?.id, sending]
  );

  // Mark as read
  const markAsRead = useCallback(async () => {
    if (!conversation?.id) return;

    try {
      await ChatRepository.markAsRead(conversation.id);
    } catch (err) {
      console.error("Error marking messages as read:", err);
    }
  }, [conversation?.id]);

  // Refresh conversation
  const refreshConversation = useCallback(async () => {
    if (conversation?.id) {
      await loadConversation(conversation.id);
    }
  }, [conversation?.id, loadConversation]);

  // Auto-load conversation when conversationId changes
  useEffect(() => {
    if (autoLoad && conversationId) {
      loadConversation(conversationId);
    }
  }, [conversationId, autoLoad, loadConversation]);

  // Auto-load messages when conversation changes
  useEffect(() => {
    if (conversation?.id) {
      loadMessages(1, true);
    }
  }, [conversation?.id, loadMessages]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    // State
    conversation,
    messages,
    loading,
    loadingMore,
    sending,
    hasMore,
    error,

    // Actions
    loadConversation,
    loadMessages,
    sendMessage,
    markAsRead,
    refreshConversation,

    // Utilities
    clearError,
  };
};
