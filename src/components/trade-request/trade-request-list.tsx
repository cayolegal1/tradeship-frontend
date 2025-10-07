import React, { useState, useEffect } from "react";
import {
  TradeRequest,
  TradeRequestWithActions,
  TradeRequestActionType,
} from "@/types/trade-request";
import { tradeRequestApi } from "@/services/api/trade-requests";
import { TradeRequestCard } from "./trade-request-card";
import styles from "./trade-request-list.module.scss";

interface TradeRequestListProps {
  type: "sent" | "received" | "all";
  currentUserId: number;
  onTradeRequestUpdate?: () => void;
}

export const TradeRequestList: React.FC<TradeRequestListProps> = ({
  type,
  currentUserId,
  onTradeRequestUpdate,
}) => {
  const [tradeRequests, setTradeRequests] = useState<TradeRequestWithActions[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadTradeRequests = async (
    pageNum: number = 1,
    append: boolean = false
  ) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: pageNum,
        limit: 10,
        direction: type === "all" ? undefined : type,
      };

      let response;
      if (type === "sent") {
        response = await tradeRequestApi.getSentTradeRequests(params);
      } else if (type === "received") {
        response = await tradeRequestApi.getReceivedTradeRequests(params);
      } else {
        response = await tradeRequestApi.getTradeRequests(params);
      }

      const newTradeRequests = response.results.map((tr: TradeRequest) =>
        enhanceTradeRequestWithActions(tr, currentUserId)
      );

      if (append) {
        setTradeRequests((prev) => [...prev, ...newTradeRequests]);
      } else {
        setTradeRequests(newTradeRequests);
      }

      setHasMore(!!response.next);
    } catch (err) {
      setError("Failed to load trade requests");
      console.error("Error loading trade requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const enhanceTradeRequestWithActions = (
    tradeRequest: TradeRequest,
    currentUserId: number
  ): TradeRequestWithActions => {
    const isFromCurrentUser = tradeRequest.requester.id === currentUserId;

    let actionType: TradeRequestActionType = "none";

    if (isFromCurrentUser) {
      // User sent this request
      if (tradeRequest.status === "PENDING") {
        actionType = "cancel";
      } else {
        actionType = "view";
      }
    } else {
      // User received this request
      if (tradeRequest.status === "PENDING") {
        actionType = "accept";
      } else {
        actionType = "view";
      }
    }

    return {
      ...tradeRequest,
      actionType,
      isFromCurrentUser,
    };
  };

  const handleAccept = async (id: number) => {
    try {
      await tradeRequestApi.acceptTradeRequest(id);
      onTradeRequestUpdate?.();
      loadTradeRequests(1, false); // Reload first page
    } catch (err) {
      console.error("Error accepting trade request:", err);
      setError("Failed to accept trade request");
    }
  };

  const handleDecline = async (id: number) => {
    try {
      await tradeRequestApi.declineTradeRequest(id);
      onTradeRequestUpdate?.();
      loadTradeRequests(1, false); // Reload first page
    } catch (err) {
      console.error("Error declining trade request:", err);
      setError("Failed to decline trade request");
    }
  };

  const handleCancel = async (id: number) => {
    try {
      await tradeRequestApi.cancelTradeRequest(id);
      onTradeRequestUpdate?.();
      loadTradeRequests(1, false); // Reload first page
    } catch (err) {
      console.error("Error cancelling trade request:", err);
      setError("Failed to cancel trade request");
    }
  };

  const handleView = (id: number) => {
    // Navigate to trade request details or open modal
    console.log("View trade request:", id);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadTradeRequests(nextPage, true);
    }
  };

  useEffect(() => {
    setPage(1);
    setTradeRequests([]);
    loadTradeRequests(1, false);
  }, [type]);

  if (loading && tradeRequests.length === 0) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading trade requests...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
        <button
          className={styles.retryButton}
          onClick={() => loadTradeRequests(1, false)}
        >
          Retry
        </button>
      </div>
    );
  }

  if (tradeRequests.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>📋</div>
        <h3>No trade requests found</h3>
        <p>
          {type === "sent"
            ? "You haven't sent any trade requests yet."
            : type === "received"
            ? "You don't have any incoming trade requests."
            : "No trade requests to display."}
        </p>
      </div>
    );
  }

  return (
    <div className={styles.tradeRequestList}>
      <div className={styles.list}>
        {tradeRequests.map((tradeRequest) => (
          <TradeRequestCard
            key={tradeRequest.id}
            tradeRequest={tradeRequest}
            onAccept={handleAccept}
            onDecline={handleDecline}
            onCancel={handleCancel}
            onView={handleView}
          />
        ))}
      </div>

      {hasMore && (
        <div className={styles.loadMore}>
          <button
            className={styles.loadMoreButton}
            onClick={loadMore}
            disabled={loading}
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
};
