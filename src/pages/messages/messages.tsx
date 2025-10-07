import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ConversationList } from "@/components/chat/conversation-list";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChatRepository } from "@/repositories";
import type { ChatConversation, ChatMessage, UserProfile } from "@/types";
import styles from "./messages.module.scss";

interface MessagesProps {
  user: UserProfile | null;
}

const Messages: React.FC<MessagesProps> = ({ user }) => {
  const [searchParams] = useSearchParams();
  const [selectedConversation, setSelectedConversation] =
    useState<ChatConversation | null>(null);
  const [loading, setLoading] = useState(false);

  // Check if there's a conversation ID in the URL
  const conversationId = searchParams.get("conversation");

  useEffect(() => {
    if (conversationId) {
      loadConversation(Number(conversationId));
    }
  }, [conversationId]);

  const loadConversation = async (id: number) => {
    try {
      setLoading(true);
      const conversation = await ChatRepository.getConversationById(id);
      setSelectedConversation(conversation);
    } catch (error) {
      console.error("Error loading conversation:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConversationSelect = (conversation: ChatConversation) => {
    setSelectedConversation(conversation);
  };

  const handleMessageSent = (message: ChatMessage) => {
    // Optionally update the conversation's last message
    if (selectedConversation) {
      setSelectedConversation((prev) =>
        prev
          ? {
              ...prev,
              lastMessage: message,
              updatedAt: message.createdAt,
            }
          : null
      );
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Loading conversation...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Messages</h1>
        <p>Chat with other traders and discuss your trades</p>
      </div>

      <div className={styles.chatContainer}>
        <div className={styles.sidebar}>
          <ConversationList
            onConversationSelect={handleConversationSelect}
            selectedConversationId={selectedConversation?.id}
          />
        </div>

        <div className={styles.chatArea}>
          {selectedConversation ? (
            <ChatMessages
              conversation={selectedConversation}
              currentUserId={user?.id}
              onMessageSent={handleMessageSent}
            />
          ) : (
            <div className={styles.welcome}>
              <div className={styles.welcomeIcon}>💬</div>
              <h3>Welcome to Messages</h3>
              <p>Select a conversation from the list to start chatting</p>
              <div className={styles.welcomeFeatures}>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>🔄</span>
                  <span>Discuss trade details</span>
                </div>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>📦</span>
                  <span>Share item information</span>
                </div>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>🤝</span>
                  <span>Negotiate terms</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
