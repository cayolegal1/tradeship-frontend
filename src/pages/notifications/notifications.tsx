import type { Dispatch, SetStateAction } from "react";
import { useMemo, useState } from "react";
import axios, { type AxiosError } from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import styles from "./notifications.module.scss";
import Head from "./components/head";
import Filter, { type FilterId } from "./components/filter";
import Main from "./components/main";
import { SERVER_URL } from "../../config";
import type { Notification } from "@/types";

interface NotificationsProps {
  notifications: Notification[];
  setNotifications: Dispatch<SetStateAction<Notification[]>>;
}

interface ApiErrorResponse {
  message?: string;
}

export default function Notifications({
  notifications,
  setNotifications,
}: NotificationsProps) {
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");

  const token = useMemo(() => {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));
    return cookie ? cookie.split("=")[1] : null;
  }, []);

  const handleError = (error: AxiosError<ApiErrorResponse>) => {
    const message =
      error.response?.data?.message ?? "We could not update your notifications.";

    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const markAllAsRead = async () => {
    if (!token) {
      return;
    }

    try {
      await axios.put(
        `${SERVER_URL}/api/notifications/mark-as-read`,
        {
          notification_id: "all",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("All notifications marked as read", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          marked_as_read: true,
        }))
      );
    } catch (error) {
      handleError(error as AxiosError<ApiErrorResponse>);
    }
  };

  const filteredNotifications = useMemo(() => {
    if (activeFilter === "all") {
      return notifications;
    }

    return notifications.filter(
      (notification) =>
        notification.type_name.toLowerCase() === activeFilter.toLowerCase()
    );
  }, [activeFilter, notifications]);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.marked_as_read).length,
    [notifications]
  );

  return (
    <section className={styles["notif"]}>
      <div className="auto__container">
        <div className={styles["notif__inner"]}>
          <Head onMarkAllAsRead={markAllAsRead} />
          <Filter
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            newNotificationsCount={unreadCount}
          />
          <Main notifications={filteredNotifications} />
        </div>
      </div>
    </section>
  );
}
