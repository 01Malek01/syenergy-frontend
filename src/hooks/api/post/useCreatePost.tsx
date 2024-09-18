import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

type Post = {
  title: string;
  content: string;
  author?: string;
};
const useCreatePost = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const createPostReq = async (post: Post) => {
    try {
      const res = await axios.post(`${backendUrl}/posts/create`, post, {
        withCredentials: true,
      });
      if (res.status === 401) throw new Error("Unauthorized");
      return res.data;
    } catch (err) {
      toast.error(err);
    }
  };

  const {
    mutateAsync: createPost,
    isPending,
    isError,
    isSuccess,
  } = useMutation({
    mutationFn: createPostReq,
    mutationKey: ["createPost"],
  });
  return { createPost, isPending, isError, isSuccess };
};

export default useCreatePost;
