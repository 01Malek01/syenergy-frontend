import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const useGetUserById = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { id } = useParams();
  const getUserByIdReq = async () => {
    try {
      const res = await axios.get(`${backendUrl}/user/${id}/profile`, {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      toast.error(err);
    }
  };
  const { isLoading, data: user } = useQuery({
    queryKey: ["userById"],
    queryFn: getUserByIdReq,
  });
  return { user, isLoading };
};

export default useGetUserById;
