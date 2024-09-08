import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

const useEditUsername = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const editUsernameReq = async (data) => {
    try {
      const res = await axios.put(
        `${backendUrl}/user/profile`,
        {
          name: data.name,
        },
        {
          withCredentials: true,
        }
      );
      return res.data;
    } catch (err) {
      toast.error(err);
    }
  };

  const {
    mutateAsync: editUsername,
    isSuccess,
    isPending,
  } = useMutation({
    mutationFn: editUsernameReq,
    onSuccess: () => {
      toast.success("Username updated successfully");
    },
    onError: () => {
      toast.error("Username update failed. Please try again");
    },
  });

  return { editUsername, isSuccess, isPending };
};
export default useEditUsername;
