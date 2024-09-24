import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

const useGetNotifications = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const getNotificationsReq = async () => {
    try {
      const res = await axios.get(`${backendUrl}/user/notifications`, {
        withCredentials: true,
      });
      if (res.status === 401) throw new Error("Unauthorized");
      return res.data;
    } catch (err) {
      toast.error(err);
    }
  };

  const { data: notifications, isLoading } = useQuery({
    queryFn: getNotificationsReq,
    queryKey: ["notifications"],
  });

  return { notifications, isLoading };
};

export default useGetNotifications;
