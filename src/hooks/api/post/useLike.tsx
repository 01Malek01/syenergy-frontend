import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const useLike = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const likePostReq = async (postId: string) => {
    await axios
      .patch(`${backendUrl}/posts/${postId}/like`)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const { mutateAsync: likePost } = useMutation({
    mutationFn: likePostReq,
    mutationKey: ["likePost"],
  });
  return { likePost };
};

export default useLike;
