const backendUrl = import.meta.env.VITE_BACKEND_URL;
import axios from "axios";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
const useLogout = () => {
  const navigate = useNavigate();
  const logoutReq = async () => {
    try {
      const res = await axios.post(`${backendUrl}/auth/logout`);
      return res.data;
    } catch (err) {
      toast.error(err);
    }
  };
  const { mutateAsync: logout, isPending } = useMutation({
    mutationFn: logoutReq,
    onSuccess: () => {
      toast.success("logout Successful");
      Cookies.remove("connect.sid");
      navigate("/auth");
    },
    onError: () => {
      toast.error("logout Failed. Please try again");
    },
  });
  return { logout, isPending };
};

export default useLogout;
