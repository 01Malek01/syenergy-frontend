import { FaFileUpload, FaPen } from "react-icons/fa";
import { useAuth } from "@/Context/AuthContext";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useUploadProfilePic } from "@/hooks/api/user/useUploadProfilePic";
import { cn } from "../../lib/utils";
import useGetUserPosts from "@/hooks/api/user/useGetUserPosts";
import PostCard from "@/components/PostCard/PostCard";
import { Post } from "types";
import useEditProfile from "@/hooks/api/user/useEditProfile";

function Profile() {
  const { user, setUser } = useAuth();
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const { uploadProfilePic, isPending } = useUploadProfilePic();
  const [file, setFile] = useState(null);
  const { userPosts, isLoading: isLoadingPosts } = useGetUserPosts();
  const [userPostsState, setUserPostsState] = useState<Post[]>([]);
  const {
    editProfile,
    isPending: isPendingEdit,
    isSuccess: isSuccessEdit,
  } = useEditProfile();

  useEffect(() => {
    if (userPosts && !isLoadingPosts) {
      setUserPostsState(userPosts);
    }
  }, [userPosts, isLoadingPosts]);
  useEffect(() => {
    console.log(user);
  }, [user]);
  const saveName = async (data: z.infer<typeof inputSchema>) => {
    await editProfile({ name: data.name });
    setUser((prevUser) => ({ ...prevUser, name: data.name }));
  };

  const saveBio = async (data: z.infer<typeof inputSchema>) => {
    await editProfile({ bio: data.bio });
    setUser((prevUser) => ({ ...prevUser, bio: data.bio }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files[0];
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("profilePic", selectedFile);
    uploadProfilePic(formData);
  };

  useEffect(() => {
    if (isSuccessEdit) {
      toast.success("Profile updated successfully");
      setIsEditingName(false);
      setIsEditingBio(false);
    }
  }, [isSuccessEdit]);

  useEffect(() => {
    if (isPendingEdit) {
      toast.info("Saving...");
    }
    return () => toast.dismiss();
  }, [isPendingEdit]);

  const inputSchema = z.object({
    name: z.string().min(3, "Username must be at least 3 characters long"),
    bio: z.string().optional(),
  });

  const form = useForm({
    defaultValues: {
      name: user?.name,
      bio: user?.bio,
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
          {/* Edit Name */}
          {isEditingName ? (
            <>
              <form onSubmit={handleSubmit(saveName)}>
                <input
                  {...register("name")}
                  type="text"
                  className="outline-none border-b-2 border-slate-500"
                />
                <button
                  type="submit"
                  className="save text-black shadow-md p-2 bg-slate-300"
                >
                  Save
                </button>
              </form>
              {errors.name && (
                <p className="text-red-500">{errors.name.message}</p>
              )}
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

          {/* Profile Image */}
          <div className="profile-image size-[200px] text-center flex justify-center rounded-full relative cursor-pointer group">
            <div
              onClick={() => document?.getElementById("file-upload")?.click()}
              className={cn(
                "profile-image-overlay absolute h-full w-full top-0 left-0 hidden group-hover:flex bg-slate-400/50 rounded-full items-center justify-center",
                { hidden: isPending, flex: file !== null }
              )}
            >
              <FaFileUpload size={40} />
              <form encType="multipart/form-data">
                <input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <button className="upload hidden" type="submit" id="upload-btn">
                  Upload
                </button>
              </form>
            </div>
            {isPending ? (
              <div className="loader"></div>
            ) : (
              <img
                src={`${user?.profilePic}`}
                alt="profile"
                className="rounded-full shadow-sm"
              />
            )}
          </div>
          {/* Followers and Following */}
          <div className="flex items-center justify-around gap-10 text-center">
            <div className="followers">
              <span className="text-xl font-semibold">
                {user?.followers?.length || 0}
              </span>
              <p className="text-sm text-gray-600">Followers</p>
            </div>
            <div className="following">
              <span className="text-xl font-semibold">
                {user?.following?.length || 0}
              </span>
              <p className="text-sm text-gray-600">Following</p>
            </div>
          </div>
        </div>

        <div className="divider w-full h-[1px] bg-black/10 my-6 "></div>

        {/* Edit Bio */}
        <div className="lower flex flex-col gap-10">
          <span className="text-2xl font-semibold text-center">Bio</span>
          {isEditingBio ? (
            <>
              <form onSubmit={handleSubmit(saveBio)}>
                <textarea
                  {...register("bio")}
                  className="w-full h-24 outline-none border-b-2 border-slate-500"
                />
                <button
                  type="submit"
                  className="save text-black shadow-md p-2 bg-slate-300"
                >
                  Save
                </button>
              </form>
              {errors.bio && (
                <p className="text-red-500">{errors.bio.message}</p>
              )}
            </>
          ) : (
            <p
              onClick={() => setIsEditingBio(true)}
              className="bio text-center tracking-tight font-md group cursor-pointer flex items-center justify-center gap-2"
            >
              {user?.bio || "Click to add a bio"}{" "}
              <FaPen
                size={15}
                className="edit hidden group-hover:flex items-center justify-center"
              />
            </p>
          )}
        </div>

        {/* User Posts */}
        <div className="user-posts mt-10">
          <h1 className="text-3xl font-semibold text-center m-10">
            Your Posts
          </h1>
          {isLoadingPosts ? (
            <div className="loader font-bold text-3xl text-center">
              Loading...
            </div>
          ) : (
            userPostsState?.map((post: Post) => (
              <PostCard
                key={post?._id}
                title={post?.title}
                content={post?.content}
                author={post?.author?.name}
                publishDate={post?.createdAt}
                likes={post?.likes}
                postId={post?._id}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
