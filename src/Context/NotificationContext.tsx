import useGetNotifications from "@/hooks/api/user/useGetNotifications";
import { useContext, useEffect, useState } from "react";
import { createContext } from "react";

const NotificationContext = createContext(null);

const NotificationContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [messageNotification, setMessageNotification] = useState(0);
  const [notificationsState, setNotificationsState] = useState(0);
  const { notifications } = useGetNotifications();
  useEffect(() => {
    if (notifications) {
      setNotificationsState(notifications.length);
      const useGetMessageNotification = notifications.filter(
        (n) => n.type === "message"
      );
      setMessageNotification(useGetMessageNotification?.length);
    }
  }, [notifications]);

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
