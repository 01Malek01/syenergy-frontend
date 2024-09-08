import { FaFileUpload } from "react-icons/fa";
import { motion } from "framer-motion";
import { FaPen } from "react-icons/fa";
import { useAuth } from "@/Context/AuthContext";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useEditUsername from "@/hooks/api/useEditUsername";
import { toast } from "react-toastify";
import { useUploadProfilePic } from "@/hooks/api/useUploadProfilePic";
import { cn } from "../../lib/utils";

function Profile() {
  const { user, setUser } = useAuth();
  const [isEditingName, setIsEditingName] = useState(false);
  const { uploadProfilePic, isPending } = useUploadProfilePic();
  const [file, setFile] = useState(null);
  const {
    editUsername,
    isPending: isPendingEdit,
    isSuccess: isSuccessEdit,
  } = useEditUsername();

  const saveName = async (data) => {
    await editUsername({ name: data.name });
    setUser((prevUser) => ({ ...prevUser, name: data.name })); // Update user context/state
  };
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    const formData = new FormData();
    formData.append("profilePic", file);
    uploadProfilePic(file);
  };
  // Handle success effect
  useEffect(() => {
    if (isSuccessEdit) {
      toast.success("Username updated successfully");
      setIsEditingName(false);
    }
  }, [isSuccessEdit]);

  // Show a loading toast
  useEffect(() => {
    if (isPendingEdit) {
      toast.info("Saving...");
    }
  }, [isPendingEdit]);

  const inputSchema = z.object({
    name: z.string().min(3, "Username must be at least 3 characters long"),
  });

  const form = useForm({
    defaultValues: {
      name: user?.name,
    },
    resolver: zodResolver(inputSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <div className="wrapper p-10 mt-10 bg-app_surface">
      <div className="container flex flex-col gap-5 w-full">
        <div className="upper flex flex-col items-center justify-center gap-10">
          {isEditingName ? (
            <>
              <form onSubmit={handleSubmit(saveName)}>
                <input
                  {...register("name")}
                  type="text"
                  className="outline-none border-b-2 border-slate-500 "
                />
                <button
                  type="submit"
                  className="save text-black shadow-md p-2 bg-slate-300"
                >
                  Save
                </button>
              </form>
              {errors && <p className="text-red-500">{errors.name?.message}</p>}
            </>
          ) : (
            <span
              onClick={() => setIsEditingName(true)}
              className="username text-3xl font-semibold group cursor-pointer flex items-center justify-center gap-2"
            >
              {user?.name}{" "}
              <FaPen
                size={15}
                className="edit hidden group-hover:flex items-center justify-center"
              />
            </span>
          )}
          <div className="profile-image size-[200px] text-center flex justify-center rounded-full relative cursor-pointer group">
            <div
              onClick={() => document?.getElementById("file-upload")?.click()}
              className={cn(
                "profile-image-overlay absolute h-full w-full top-0 left-0 hidden group-hover:flex bg-slate-400/50 rounded-full items-center justify-center",
                { hidden: isPending, flex: file !== null }
              )}
            >
              <FaFileUpload size={40} />
              <input
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            {isPending ? (
              <div className="loader"></div>
            ) : (
              <img
                src={`${user?.profilePic ?? "logo.jpg"}`}
                alt="profile"
                className="rounded-full shadow-sm"
              />
            )}
          </div>
          <div className="interactions flex flex-row justify-between gap-8">
            <div className="followers flex flex-col items-center justify-center">
              <span className="text-2xl font-semibold">Followers</span>
              <span>0</span>
            </div>
            <div className="following flex flex-col items-center justify-center">
              <span className="text-2xl font-semibold">Following</span>
              <span>0</span>
            </div>
          </div>
        </div>
        <div className="divider w-full h-[1px] bg-black/10 my-6 "></div>
        <div className="lower flex flex-col gap-10">
          <span className="text-2xl font-semibold text-center">Bio</span>
          <p className="bio text-center tracking-tight font-md ">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi
            necessitatibus deleniti porro natus, eligendi quasi ad aliquam.
            Nihil, expedita laboriosam.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Profile;
