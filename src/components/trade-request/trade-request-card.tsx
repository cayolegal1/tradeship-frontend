import React from "react";
import { TradeRequestWithActions } from "@/types/trade-request";
import { useDirectChat } from "@/hooks/useDirectChat";
import styles from "./trade-request-card.module.scss";

interface TradeRequestCardProps {
  tradeRequest: TradeRequestWithActions;
  onAccept?: (id: number) => void;
  onDecline?: (id: number) => void;
  onCancel?: (id: number) => void;
  onView?: (id: number) => void;
}

export const TradeRequestCard: React.FC<TradeRequestCardProps> = ({
  tradeRequest,
  onAccept,
  onDecline,
  onCancel,
  onView,
}) => {
  const { openDirectChat } = useDirectChat();
  const {
    id,
    status,
    message,
    cashAmount,
    expiresAt,
    createdAt,
    requester,
    recipient,
    requestedItem,
    proposedItem,
    actionType,
    isFromCurrentUser,
  } = tradeRequest;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return styles.statusPending;
      case "ACCEPTED":
        return styles.statusAccepted;
      case "DECLINED":
        return styles.statusDeclined;
      case "EXPIRED":
        return styles.statusExpired;
      case "CANCELLED":
        return styles.statusCancelled;
      default:
        return styles.statusDefault;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return isFromCurrentUser ? "Sent" : "Pending";
      case "ACCEPTED":
        return "Accepted";
      case "DECLINED":
        return "Declined";
      case "EXPIRED":
        return "Expired";
      case "CANCELLED":
        return "Cancelled";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className={styles.tradeRequestCard}>
      <div className={styles.header}>
        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>
            {isFromCurrentUser ? (
              <img
                src={recipient.avatar || "/default-avatar.png"}
                alt={recipient.username}
              />
            ) : (
              <img
                src={requester.avatar || "/default-avatar.png"}
                alt={requester.username}
              />
            )}
          </div>
          <div className={styles.userDetails}>
            <h4 className={styles.username}>
              {isFromCurrentUser ? recipient.username : requester.username}
            </h4>
            <p className={styles.date}>{formatDate(createdAt)}</p>
          </div>
        </div>
        <span className={`${styles.status} ${getStatusColor(status)}`}>
          {getStatusText(status)}
        </span>
      </div>

      <div className={styles.content}>
        <div className={styles.tradeInfo}>
          <div className={styles.itemSection}>
            <div className={styles.itemCard}>
              <img
                src={requestedItem.primaryImage || "/default-item.png"}
                alt={requestedItem.name}
                className={styles.itemImage}
              />
              <div className={styles.itemInfo}>
                <h6 className={styles.itemName}>{requestedItem.name}</h6>
                <p className={styles.itemPrice}>
                  {formatCurrency(requestedItem.price)}
                </p>
              </div>
            </div>
          </div>

          <div className={styles.tradeArrow}>→</div>

          <div className={styles.itemSection}>
            {proposedItem ? (
              <div className={styles.itemCard}>
                <img
                  src={proposedItem.primaryImage || "/default-item.png"}
                  alt={proposedItem.name}
                  className={styles.itemImage}
                />
                <div className={styles.itemInfo}>
                  <h6 className={styles.itemName}>{proposedItem.name}</h6>
                  <p className={styles.itemPrice}>
                    {formatCurrency(proposedItem.price)}
                  </p>
                </div>
              </div>
            ) : cashAmount ? (
              <div className={styles.cashOffer}>
                <div className={styles.cashIcon}>💰</div>
                <div className={styles.cashAmount}>
                  {formatCurrency(cashAmount)}
                </div>
              </div>
            ) : (
              <div className={styles.noOffer}>
                <p>No specific offer</p>
              </div>
            )}
          </div>
        </div>

        {message && (
          <div className={styles.message}>
            <p>"{message}"</p>
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <button
          className={`${styles.actionButton} ${styles.chatButton}`}
          onClick={() =>
            openDirectChat(
              isFromCurrentUser ? recipient.id : requester.id,
              `Hi! I'd like to discuss the trade request for ${requestedItem.name}.`
            )
          }
        >
          💬 Chat
        </button>

        {actionType === "accept" && (
          <>
            <button
              className={`${styles.actionButton} ${styles.acceptButton}`}
              onClick={() => onAccept?.(id)}
            >
              Accept
            </button>
            <button
              className={`${styles.actionButton} ${styles.declineButton}`}
              onClick={() => onDecline?.(id)}
            >
              Decline
            </button>
          </>
        )}
        {actionType === "cancel" && (
          <button
            className={`${styles.actionButton} ${styles.cancelButton}`}
            onClick={() => onCancel?.(id)}
          >
            Cancel
          </button>
        )}
        {actionType === "view" && (
          <button
            className={`${styles.actionButton} ${styles.viewButton}`}
            onClick={() => onView?.(id)}
          >
            View Details
          </button>
        )}
      </div>
    </div>
  );
};
