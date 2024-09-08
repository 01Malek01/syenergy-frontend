const backendUrl = import.meta.env.VITE_BACKEND_URL;
import axios from "axios";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
const useGoogleLogin = () => {
  const navigate = useNavigate();
  const loginReq = async () => {
    try {
      const res = await axios.get(`${backendUrl}/auth/login/federated/google`, {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      toast.error(err);
    }
  };
  const { mutateAsync: googleLogin, isPending } = useMutation({
    mutationFn: loginReq,
    onSuccess: () => {
      toast.success("Login Successful");
      navigate("/");
    },
    onError: () => {
      toast.error("Login Failed. Please try again");
    },
  });
  return { googleLogin, isPending };
};

export default useGoogleLogin;
