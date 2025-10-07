import React, { useState, useEffect } from "react";
import { TradeRequestList } from "@/components/trade-request/trade-request-list";
import { tradeRequestApi } from "@/services/api/trade-requests";
import { TradeRequestStats } from "@/types/trade-request";
import { UserProfile } from "@/types";
import styles from "./trade-requests.module.scss";

type TabType = "sent" | "received" | "all";

interface TradeRequestsProps {
  user: UserProfile | null;
}

export const TradeRequests: React.FC<TradeRequestsProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<TabType>("received");
  const [stats, setStats] = useState<TradeRequestStats | null>(null);
  const [loading, setLoading] = useState(true);
  const currentUserId = user?.id || 0;

  const loadStats = async () => {
    try {
      const response = await tradeRequestApi.getTradeRequestStats();
      setStats(response.data);
    } catch (error) {
      console.error("Error loading trade request stats:", error);
    }
  };

  useEffect(() => {
    const initializePage = async () => {
      setLoading(true);
      await loadStats();
      setLoading(false);
    };

    initializePage();
  }, []);

  const handleTradeRequestUpdate = () => {
    loadStats(); // Refresh stats when trade requests are updated
  };

  const tabs = [
    {
      id: "received" as TabType,
      label: "Received",
      count: stats?.pendingReceived || 0,
      description: "Trade requests you need to respond to",
    },
    {
      id: "sent" as TabType,
      label: "Sent",
      count: stats?.pendingSent || 0,
      description: "Trade requests you have sent",
    },
    {
      id: "all" as TabType,
      label: "All",
      count: (stats?.totalSent || 0) + (stats?.totalReceived || 0),
      description: "All your trade requests",
    },
  ];

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading trade requests...</p>
      </div>
    );
  }

  return (
    <div className={styles.tradeRequestsPage}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Trade Requests</h1>
          <p className={styles.subtitle}>
            Manage your trade requests and proposals
          </p>
        </div>

        {stats && (
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{stats.pendingReceived}</div>
              <div className={styles.statLabel}>Pending</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{stats.acceptedReceived}</div>
              <div className={styles.statLabel}>Accepted</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{stats.totalSent}</div>
              <div className={styles.statLabel}>Sent</div>
            </div>
          </div>
        )}
      </div>

      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tab} ${
                activeTab === tab.id ? styles.activeTab : ""
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <div className={styles.tabContent}>
                <div className={styles.tabLabel}>
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={styles.tabBadge}>{tab.count}</span>
                  )}
                </div>
                <div className={styles.tabDescription}>{tab.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.content}>
        <TradeRequestList
          type={activeTab}
          currentUserId={currentUserId}
          onTradeRequestUpdate={handleTradeRequestUpdate}
        />
      </div>
    </div>
  );
};

export default TradeRequests;
