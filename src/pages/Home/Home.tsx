import { IoChatbubbleEllipses } from "react-icons/io5";
import Chat from "@/components/Chat/Chat";
import CreatePost from "@/components/CreatePost/CreatePost";
import Posts from "@/components/Posts/Posts";
import { useEffect, useState } from "react";
import "react-resizable/css/styles.css"; // Import the necessary styles for resizing
import { motion } from "framer-motion";
import { FaArrowCircleRight, FaBars } from "react-icons/fa"; // Added FaBars for menu icon
import { cn } from "@/lib/utils";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { useAuth } from "@/Context/AuthContext";
import dayjs from "dayjs";
import { User } from "types";
import FollowButton from "@/components/FollowButton/FollowButton";
import useGetExplorePeople from "@/hooks/api/user/useGetExplorePeople";
import { useSocket } from "@/Context/SocketContext";
import { useNotificationContext } from "@/Context/NotificationContext";

function Home() {
  const [collapseChat, setCollapseChat] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const { user: authUser } = useAuth();
  const { users: fetchedUsers, isLoading } = useGetExplorePeople();
  const [followed, setFollowed] = useState(false);
  const { messageNotification } = useNotificationContext();
  const { socket } = useSocket();
  const [menuOpen, setMenuOpen] = useState(false); // State to manage menu visibility

  useEffect(() => {
    socket?.emit("register", authUser?._id);
  }, [authUser, socket]);

  useEffect(() => {
    if (fetchedUsers) {
      setUsers(fetchedUsers);
    }
  }, [fetchedUsers]);

  useEffect(() => {
    if (users && users.length > 0) {
      users.forEach((user) => {
        if (user?.followers?.includes(authUser?._id)) {
          setFollowed(true);
        }
      });
    }
  }, [users, authUser]);

  return (
    <div className="wrapper px-5 relative  min-h-screen overflow-x-hidden">
      <div className="container grid grid-cols-8 gap-4 min-h-screen overflow-y-auto">
        {/* First column - Create Post and Posts */}
        <div
          className={cn(
            "lg:col-span-6 col-span-8 flex flex-col items-center justify-start gap-4 h-screen py-5"
          )}
        >
          <div className="create-post-posts-container w-full flex flex-col items-center gap-4 h-full overflow-y-auto">
            <div className="create-post w-full lg:w-1/2">
              <CreatePost />
            </div>
            <div className="posts w-full">
              <Posts />
            </div>
          </div>
        </div>

        {/* Button to open the side menu on mobile */}
        <button
          className="lg:hidden fixed top-30 left-2 z-50 text-3xl text-gray-700"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <FaBars />
        </button>
        {/* Second column - Explore Friends (Mobile Sidebar) */}
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: menuOpen ? "0%" : "-100%" }}
          transition={{ duration: 0.5 }}
          className="fixed  top-0 right-0 h-screen lg:col-span-2 col-span-8 bg-white lg:bg-transparent shadow-lg lg:shadow-none z-40 lg:translate-x-0 translate-x-full lg:relative lg:block w-full lg:w-auto "
        >
          <div className="explore-friends my-10 h-full p-4 ">
            <h1 className="text-2xl font-semibold my-4 text-center">
              Explore More People
            </h1>
            <div className="explore-container flex flex-col justify-center items-center gap-5">
              {isLoading ? (
                <div className="flex justify-center items-center">
                  <div className="loader animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
                </div>
              ) : (
                users.length > 0 &&
                users
                  ?.filter(({ _id }: User) => _id !== authUser?._id)
                  .map(
                    ({ _id, name, followers, createdAt, profilePic }: User) => (
                      <Card
                        key={_id}
                        className="p-4 shadow-md rounded-lg hover:shadow-lg transition-shadow w-full max-w-xs"
                      >
                        <CardHeader className="text-xl text-center font-semibold text-gray-800 border-b pb-2 mb-4 flex flex-col gap-2">
                          <div>{name}</div>
                          <div className="flex items-center justify-center">
                            <img
                              src={profilePic || "/logo.jpg"}
                              alt="profile pic"
                              className="w-20 h-20 rounded-full"
                            />
                          </div>
                        </CardHeader>
                        <CardFooter className="flex flex-col gap-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Followers:</span>{" "}
                            {followers?.length || 0}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Joined:</span>{" "}
                            {dayjs(createdAt).format("DD/MM/YYYY")}
                          </div>
                          <FollowButton
                            targetUserId={_id}
                            followed={followed}
                            setFollowed={setFollowed}
                          />
                        </CardFooter>
                      </Card>
                    )
                  )
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Chat Section */}
      <motion.div
        animate={{ x: collapseChat ? "100%" : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="lg:w-1/4 w-[90%] h-screen bg-slate-100 rounded-md p-3 absolute top-10 right-0 shadow-md"
      >
        <span className="collapse-chat absolute">
          {collapseChat ? (
            <div className="relative">
              <IoChatbubbleEllipses
                onClick={() => setCollapseChat((prev) => !prev)}
                className="text-3xl cursor-pointer absolute right-0 top-[50%] translate-y-[-40%] left-[-40px] text-app_primary scale-x-[-1] hover:scale-x-[-1] transform hover:scale-105 "
              />
              <span
                className={cn(
                  "absolute -top-4 right-9 bg-red-500 rounded-full h-4 w-4 flex items-center justify-center",
                  {
                    hidden: messageNotification === 0,
                  }
                )}
              >
                {messageNotification}
              </span>
            </div>
          ) : (
            <FaArrowCircleRight
              onClick={() => setCollapseChat((prev) => !prev)}
              className="text-3xl cursor-pointer absolute right-0 top-[50%] translate-y-[-40%] left-[-40px] text-app_primary hover:scale-105"
            />
          )}
        </span>
        <div className="h-1/2">
          <Chat />
        </div>
      </motion.div>
    </div>
  );
}

export default Home;
