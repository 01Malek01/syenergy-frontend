const backendUrl = import.meta.env.VITE_BACKEND_URL;
import axios from "axios";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
const useLogin = () => {
  const navigate = useNavigate();
  const loginReq = async (data: { email: string; password: string }) => {
    try {
      const res = await axios.post(`${backendUrl}/auth/login`, data, {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      toast.error(err);
    }
  };
  const { mutateAsync: login, isSuccess } = useMutation({
    mutationFn: loginReq,
    onSuccess: () => {
      toast.success("Login Successful");
      navigate("/");
    },
    onError: () => {
      toast.error("Login Failed. Please try again");
    },
  });
  return { login, isSuccess };
};

export default useLogin;
