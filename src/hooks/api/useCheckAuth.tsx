import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

const useCheckAuth = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const checkAuthReq = async () => {
    try {
      const res = await axios.get(`${backendUrl}/auth/check-auth`, {
        withCredentials: true,
      });
      if (res.status === 401) throw new Error("Unauthorized");
      return res.data;
    } catch (err) {
      toast.error(err);
    }
  };
  const { data: user, isLoading } = useQuery({
    queryFn: checkAuthReq,
    queryKey: ["checkAuth"],
  });
  return { user, isLoading };
};
export default useCheckAuth;
