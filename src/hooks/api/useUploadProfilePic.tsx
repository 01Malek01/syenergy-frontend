import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useUploadProfilePic = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const uploadProfilePicReq = async (file: FormData) => {
    const res = await axios.post(
      `${backendUrl}/user/profile/uploadProfilePic`,
      file,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res.data;
  };

  const { mutateAsync: uploadProfilePic, isPending } = useMutation({
    mutationFn: uploadProfilePicReq,

    onSuccess: (data) => {
      console.log(data);
    },
  });
  return { uploadProfilePic, isPending };
};
