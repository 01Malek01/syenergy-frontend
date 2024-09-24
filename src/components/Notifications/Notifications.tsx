import { useAuth } from "@/Context/AuthContext";
import useGetNotifications from "@/hooks/api/user/useGetNotifications";
import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND);
function Notifications() {
  const [notificationsState, setNotificationsState] = useState([]);
  const { user: authUser } = useAuth();
  const { notifications } = useGetNotifications();

  useEffect(() => {
    console.log("notifications", notifications);
  }, [notifications]);
  useEffect(() => {
    socket.on("followNotification", (data) => {
      console.log(data);
      if (authUser?._id === data?.senderId) {
        setNotificationsState((prev) => [...prev, data.message]);
      }
    });
  }, [authUser?._id]);
  return (
    <div className="container">
      {notificationsState?.length > 0 ? (
        notificationsState?.map((notification, index) => {
          return (
            <div className="notification" key={index}>
              <p>{notification}</p>
            </div>
          );
        })
      ) : (
        <p className="text-center text-sm">No new notifications</p>
      )}
    </div>
  );
}

export default Notifications;
