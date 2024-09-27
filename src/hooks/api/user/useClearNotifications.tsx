import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

const useClearNotifications = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const clearNotificationsReq = async () => {
    try {
      const res = await axios.delete(`${backendUrl}/user/notifications`, {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      toast.error(err);
    }
  };
  const { mutateAsync: clearNotifications } = useMutation({
    mutationFn: clearNotificationsReq,
    mutationKey: ["clearNotifications"],
  });
  return { clearNotifications };
};

export default useClearNotifications;
