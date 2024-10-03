import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { IoMdCloseCircle } from "react-icons/io";
import useGetUserById from "@/hooks/api/user/useGetUserById";
import { toast } from "react-toastify";
import { useAuth } from "@/Context/AuthContext";
import FollowButton from "@/components/FollowButton/FollowButton";
import useGetPostsByUser from "@/hooks/api/post/useGetPostsByUser";
import PostCard from "@/components/PostCard/PostCard";
import { Post } from "types";

function UserProfile() {
  const [showPhoto, setShowPhoto] = useState(false);
  const { user, isLoading } = useGetUserById();
  const [userState, setUserState] = useState(user);
  const { user: authUser } = useAuth();
  const [followed, setFollowed] = useState(false);
  const { posts } = useGetPostsByUser(userState?._id);

  useEffect(() => {
    if (isLoading) toast.info("Loading...");
    setUserState(user);
    console.log(posts, "user profile posts");
    return () => toast.dismiss();
  }, [user, isLoading, posts]);
  useEffect(() => {
    if (authUser) {
      if (user?.followers?.includes(authUser._id)) {
        setFollowed(true);
      } else {
        setFollowed(false);
      }
    }
  }, [authUser, user]);
  // const followHandler = async () => {
  //   if (authUser) {
  //     if (followed) {
  //       await unFollowUser({
  //         userId: userState?._id,
  //       });
  //       setFollowed(false);
  //     } else {
  //       await followUser({
  //         userId: userState?._id,
  //       });
  //       setFollowed(true);
  //     }
  //   }
  // };
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
            className="profile-image size-[200px] text-center flex justify-center rounded-full relative cursor-pointer"
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
              "show-photo flex w-full h-screen items-center justify-center top-10 z-10 bg-black/50 mx-auto fixed ",
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
              className="rounded-full shadow-sm size-[500px] text-center"
            />
          </div>
        </div>

        {/* Followers and Following */}
        <div className="flex items-center justify-center gap-10 text-center mt-5">
          <div className="followers">
            <span className="text-xl font-semibold">
              {userState?.followers?.length || 0}
            </span>
            <p className="text-sm text-gray-600">Followers</p>
          </div>
          <div className="following">
            <span className="text-xl font-semibold">
              {userState?.following?.length || 0}
            </span>
            <p className="text-sm text-gray-600">Following</p>
          </div>

          <FollowButton
            targetUserId={userState?._id}
            followed={followed}
            setFollowed={setFollowed}
          />
        </div>

        <div className="divider w-full h-[1px] bg-black/10 my-6 "></div>

        <div className="lower flex flex-col gap-10">
          {userState?.bio && (
            <span className="text-2xl font-semibold text-center">Bio</span>
          )}
          <p className="bio text-center tracking-tight font-md group flex items-center justify-center gap-2">
            {userState?.bio}
          </p>
        </div>

        {/* User Posts */}
        <div className="user-posts mt-10">
          <h1 className="text-3xl font-semibold text-center m-10">
            {userState?.name} posts
          </h1>
          {posts?.map((post: Post) => (
            <PostCard
              key={post._id}
              author={userState?.name}
              authorId={userState?._id}
              postId={post._id}
              title={post.title}
              content={post.content}
              likes={post.likes}
              publishDate={post.createdAt}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
