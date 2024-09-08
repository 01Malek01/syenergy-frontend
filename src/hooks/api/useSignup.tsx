const backendUrl = import.meta.env.VITE_BACKEND_URL;
import axios from "axios";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
const useSignup = () => {
  const navigate = useNavigate();
  const signupReq = async (data: { email: string; password: string }) => {
    try {
      const res = await axios.post(`${backendUrl}/auth/register`, data, {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      toast.error(err);
    }
  };
  const { mutateAsync: signup, isSuccess } = useMutation({
    mutationFn: signupReq,
    onSuccess: () => {
      toast.success("Signup Successful");
      navigate("/");
    },
    onError: () => {
      toast.error("Signup Failed. Please try again");
    },
  });
  return { signup, isSuccess };
};

export default useSignup;
