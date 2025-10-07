import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { sendIcon, attachIcon } from "@/base/SVG";
import { useChat } from "@/hooks/useChat";
import type { ChatConversation } from "@/types";
import styles from "./chat-messages.module.scss";

interface ChatMessagesProps {
  conversation: ChatConversation;
  currentUserId?: number;
  onMessageSent?: (message: any) => void;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  conversation,
  currentUserId,
  onMessageSent,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [newMessage, setNewMessage] = React.useState("");

  const {
    messages,
    loading,
    loadingMore,
    sending,
    hasMore,
    error,
    loadMessages,
    sendMessage,
    markAsRead,
    clearError,
  } = useChat({ conversationId: conversation.id });

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || sending) return;

    try {
      await sendMessage(newMessage.trim());
      setNewMessage("");
      onMessageSent?.(messages[messages.length - 1]);

      // Scroll to bottom after sending
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    } catch (err) {
      toast.error("Failed to send message");
    }
  };

  // Handle load more
  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      loadMessages();
    }
  };

  // Format message time
  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Format message date
  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  // Check if should show date
  const shouldShowDate = (message: any, index: number) => {
    if (index === 0) return true;

    const currentDate = new Date(message.createdAt).toDateString();
    const previousDate = new Date(messages[index - 1].createdAt).toDateString();

    return currentDate !== previousDate;
  };

  // Check if should show avatar
  const shouldShowAvatar = (message: any, index: number) => {
    if (index === messages.length - 1) return true;

    const nextMessage = messages[index + 1];
    return nextMessage.sender.id !== message.sender.id;
  };

  // Get conversation title
  const getConversationTitle = () => {
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

  // Mark as read when conversation changes
  useEffect(() => {
    if (conversation.id) {
      markAsRead();
    }
  }, [conversation.id, markAsRead]);

  // Scroll to bottom on initial load
  useEffect(() => {
    if (messages.length > 0 && !loading) {
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [messages.length, loading]);

  // Clear error when it changes
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  if (loading && messages.length === 0) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Loading messages...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            <img
              src={conversation.participants[0]?.avatar || "/avatar.png"}
              alt={getConversationTitle()}
            />
          </div>
          <div className={styles.details}>
            <h3>{getConversationTitle()}</h3>
            <p>Online</p>
          </div>
        </div>
      </div>

      <div className={styles.messagesContainer} ref={messagesContainerRef}>
        {hasMore && (
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

        <div className={styles.messages}>
          <AnimatePresence>
            {messages.map((message, index) => (
              <React.Fragment key={message.id}>
                {shouldShowDate(message, index) && (
                  <div className={styles.dateSeparator}>
                    {formatMessageDate(message.createdAt)}
                  </div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`${styles.message} ${
                    message.sender.id === currentUserId
                      ? styles.myMessage
                      : styles.otherMessage
                  }`}
                >
                  {shouldShowAvatar(message, index) && (
                    <div className={styles.messageAvatar}>
                      <img
                        src={message.sender.avatar || "/avatar.png"}
                        alt={message.sender.username}
                      />
                    </div>
                  )}

                  <div className={styles.messageContent}>
                    <div className={styles.messageBubble}>
                      <p>{message.content}</p>
                      <span className={styles.messageTime}>
                        {formatMessageTime(message.createdAt)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </React.Fragment>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form onSubmit={handleSendMessage} className={styles.inputContainer}>
        <div className={styles.inputWrapper}>
          <button type="button" className={styles.attachButton}>
            {attachIcon}
          </button>

          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className={styles.messageInput}
            disabled={sending}
          />

          <button
            type="submit"
            className={styles.sendButton}
            disabled={!newMessage.trim() || sending}
          >
            {sending ? <div className={styles.sendingSpinner} /> : sendIcon}
          </button>
        </div>
      </form>
    </div>
  );
};
