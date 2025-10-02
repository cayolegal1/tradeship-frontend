import type { CSSProperties } from "react";
import { useCallback, useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import { apiClient } from "@/services/api/client";
import BarLoader from "react-spinners/BarLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@/assets/css/main.scss";

import Auth from "./auth/auth";
import Footer from "./base/footer/footer";
import Header from "./base/header/header";
import Landing from "./pages/landing/landing";
import Browse from "./pages/browse/browse";
import Messages from "./pages/messages/messages";
import Trade from "./pages/trade/trade";
import Wallet from "./pages/wallet/wallet";
import MyTrades from "./pages/my-trades/my-trades";
import Profile from "./pages/profile/profile";
import Notifications from "./pages/notifications/notifications";

import type { Notification, PaginatedResponse, UserProfile } from "./types";

interface ApiErrorResponse {
  message?: string;
}

interface NotificationApiModel extends Omit<Notification, "marked_as_read"> {
  marked_as_read: boolean | 0 | 1;
}

const loaderStyles: CSSProperties = {
  display: "block",
  margin: "10vh auto",
  borderColor: "red",
};

const normaliseNotifications = (
  items: NotificationApiModel[]
): Notification[] =>
  items.map((item) => ({
    ...item,
    marked_as_read: Boolean(item.marked_as_read),
  }));

function App() {
  const location = useLocation();
  const [isLoaded, setIsLoaded] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    navigate("/auth/", { replace: true,  });
  }, []);

  const handleApiError = useCallback(
    (error: AxiosError<ApiErrorResponse>) => {
      if (error.response?.status === 401) {
        logout();
        return;
      }

      const message =
        error.response?.data?.message ?? "Unexpected error. Please try again.";

      toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    },
    [logout]
  );

  const getUserData = useCallback(async () => {
    try {
      const response = await apiClient.get<UserProfile>("/api/auth/user/");

      setUser(response.data);
      setIsLoaded(true);
    } catch (error) {
      handleApiError(error as AxiosError<ApiErrorResponse>);
      setIsLoaded(true);
    }
  }, [handleApiError]);

  const getNotifications = useCallback(async () => {
    try {
      const response = await apiClient.get<PaginatedResponse<NotificationApiModel>>(
        "/api/notifications/notifications/"
      );

      setNotifications(normaliseNotifications(response.data.results));
    } catch (error) {
      handleApiError(error as AxiosError<ApiErrorResponse>);
    }
  }, [handleApiError]);

  // useEffect(() => {
  //   void getUserData();
  //   void getNotifications();
  // }, [getNotifications, getUserData]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  if (!isLoaded) {
    return (
      <div
        className="flex justify-center items-center"
        style={{ height: "100vh", backgroundColor: "#fff" }}
      >
        <div style={{ top: "20vh", position: "relative" }}>
          <BarLoader color="#209999" cssOverride={loaderStyles} />
        </div>
      </div>
    );
  }

  return (
    <main className="main">
      <ToastContainer />
      <Header user={user} notifications={notifications} />
      <Routes>
        <Route path="" element={<Landing />} />
        <Route path="/messages" element={<Messages />} />
        <Route
          path="/notifications"
          element={
            <Notifications
              notifications={notifications}
              setNotifications={setNotifications}
            />
          }
        />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/my-trades" element={<MyTrades />} />
        <Route path="/user-profile" element={<Profile user={user} />} />
        <Route path="/trade/*" element={<Trade />} />
        <Route path="/browse/*" element={<Browse />} />
        <Route path="/auth/*" element={<Auth />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </main>
  );
}

export default App;


