import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { IoMdCloseCircle } from "react-icons/io";
import useGetUserById from "@/hooks/api/user/useGetUserByID";
import { toast } from "react-toastify";

function UserProfile() {
  const [showPhoto, setShowPhoto] = useState(false);
  const { user, isLoading } = useGetUserById();
  const [userState, setUserState] = useState(user);
  useEffect(() => {
    if (isLoading) toast.info("Loading...");
    setUserState(user);
    console.log("user", user);
    return () => toast.dismiss();
  }, [user, isLoading]);
  return (
    <div className="wrapper p-10 mt-10 bg-app_surface">
      <div className="container flex flex-col gap-5 w-full">
        <div className="upper flex flex-col items-center justify-center gap-10">
          <span className="username text-3xl font-semibold group cursor-pointer flex items-center justify-center gap-2">
            {userState?.name}
          </span>

          {/* Profile Image */}
          <div
            onClick={() => setShowPhoto(true)}
            className="profile-image size-[200px] text-center flex justify-center rounded-full relative cursor-pointer  "
          >
            <img
              src={userState?.profilePic}
              alt="profile"
              className="rounded-full shadow-sm"
            />
          </div>
          {/* show Photo */}
          <div
            className={cn(
              "show-photo flex w-full h-screen items-center justify-center  top-10 z-10 bg-black/50 mx-auto fixed ",
              {
                hidden: !showPhoto,
              }
            )}
          >
            <span
              onClick={() => setShowPhoto(false)}
              className="close flex items-center justify-center absolute top-10 right-10 cursor-pointer hover:scale-125"
            >
              <IoMdCloseCircle size={50} />
            </span>
            <img
              src={`/logo.jpg`}
              alt="profile"
              className="rounded-full shadow-sm  size-[500px] text-center "
            />
          </div>
        </div>

        <div className="divider w-full h-[1px] bg-black/10 my-6 "></div>

        <div className="lower flex flex-col gap-10">
          <span className="text-2xl font-semibold text-center">Bio</span>

          <p className="bio text-center tracking-tight font-md group  flex items-center justify-center gap-2">
            {userState?.bio}
          </p>
        </div>

        {/* User Posts */}
        <div className="user-posts mt-10">
          <h1 className="text-3xl font-semibold text-center m-10">Posts</h1>
          posts here
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
