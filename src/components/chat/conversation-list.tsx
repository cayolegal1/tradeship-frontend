import React from "react";
import { motion } from "framer-motion";
import { useConversations } from "@/hooks/useConversations";
import type { ChatConversation } from "@/types";
import styles from "./conversation-list.module.scss";

interface ConversationListProps {
  onConversationSelect?: (conversation: ChatConversation) => void;
  selectedConversationId?: number;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  onConversationSelect,
  selectedConversationId,
}) => {
  const {
    conversations,
    loading,
    loadingMore,
    hasMore,
    error,
    loadConversations,
    clearError,
  } = useConversations();

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      loadConversations();
    }
  };

  const handleConversationClick = (conversation: ChatConversation) => {
    onConversationSelect?.(conversation);
  };

  const formatLastMessageTime = (dateString?: string) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffDays > 0) {
      return `${diffDays}d ago`;
    } else if (diffHours > 0) {
      return `${diffHours}h ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes}m ago`;
    } else {
      return "Just now";
    }
  };

  const getConversationTitle = (conversation: ChatConversation) => {
    if (conversation.title) {
      return conversation.title;
    }

    if (
      conversation.conversationType === "DIRECT" &&
      conversation.participants.length > 0
    ) {
      const otherParticipant = conversation.participants[0];
      return `${otherParticipant.firstName} ${otherParticipant.lastName}`;
    }

    return "Group Chat";
  };

  const getConversationAvatar = (conversation: ChatConversation) => {
    if (
      conversation.conversationType === "DIRECT" &&
      conversation.participants.length > 0
    ) {
      return conversation.participants[0].avatar;
    }
    return null;
  };

  if (loading && conversations.length === 0) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Loading conversations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
        <button onClick={clearError}>Retry</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Conversations</h3>
      </div>

      {conversations.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>💬</div>
          <p>No conversations yet</p>
        </div>
      ) : (
        <div className={styles.list}>
          {conversations.map((conversation) => (
            <motion.div
              key={conversation.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${styles.conversation} ${
                selectedConversationId === conversation.id
                  ? styles.selected
                  : ""
              }`}
              onClick={() => handleConversationClick(conversation)}
            >
              <div className={styles.avatar}>
                <img
                  src={getConversationAvatar(conversation) || "/avatar.png"}
                  alt={getConversationTitle(conversation)}
                />
              </div>

              <div className={styles.content}>
                <div className={styles.header}>
                  <h4>{getConversationTitle(conversation)}</h4>
                  {conversation.lastMessageAt && (
                    <span className={styles.time}>
                      {formatLastMessageTime(conversation.lastMessageAt)}
                    </span>
                  )}
                </div>

                {conversation.lastMessage && (
                  <p className={styles.lastMessage}>
                    {conversation.lastMessage.content.length > 50
                      ? `${conversation.lastMessage.content.substring(
                          0,
                          50
                        )}...`
                      : conversation.lastMessage.content}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {hasMore && conversations.length > 0 && (
        <div className={styles.loadMore}>
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className={styles.loadMoreButton}
          >
            {loadingMore ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
};
