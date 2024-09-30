import useGetNotifications from "@/hooks/api/user/useGetNotifications";
import { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import { useAuth } from "./AuthContext";
import { Notification as NotificationType } from "types";
import { useSocket } from "./SocketContext";

const NotificationContext = createContext(null);

const NotificationContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { socket } = useSocket();
  const { user } = useAuth();
  const [messageNotification, setMessageNotification] = useState(0);
  const [notificationsState, setNotificationsState] = useState(0);
  const { notifications } = useGetNotifications();
  useEffect(() => {
    if (notifications && user?.isAuthenticated) {
      setNotificationsState(notifications);
      const useGetMessageNotification = notifications?.filter(
        (n: NotificationType) => n.type === "message"
      );
      setMessageNotification(useGetMessageNotification?.length);
    }
  }, [notifications, user?.isAuthenticated]);
  useEffect(() => {
    socket?.on("receiveMessage", (message) => {
      setMessageNotification((prev) => prev + 1);
    });
  }, [socket]);

  return (
    <NotificationContext.Provider
      value={{
        messageNotification,
        notificationsState,
        setNotificationsState,
        setMessageNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

const useNotificationContext = () => {
  return useContext(NotificationContext);
};

export { useNotificationContext, NotificationContextProvider };
