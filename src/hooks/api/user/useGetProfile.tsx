import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

const useGetProfile = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const getProfileReq = async () => {
    try {
      const res = await axios.get(`${backendUrl}/user/profile`, {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      toast.error(err);
    }
  };

  const { data: profile, isLoading } = useQuery({
    queryFn: getProfileReq,
    queryKey: ["profile"],
  });

  return { profile, isLoading };
};
export default useGetProfile;
