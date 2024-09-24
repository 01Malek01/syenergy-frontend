import { IoChatbubbleEllipses } from "react-icons/io5";
import Chat from "@/components/Chat/Chat";
import CreatePost from "@/components/CreatePost/CreatePost";
import Posts from "@/components/Posts/Posts";
import { useEffect, useState } from "react";
import "react-resizable/css/styles.css"; // Import the necessary styles for resizing
import { motion } from "framer-motion";
import { FaArrowCircleRight } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import useGetAllUsers from "@/hooks/api/chat/useGetAllUsers";
import { useAuth } from "@/Context/AuthContext";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { io } from "socket.io-client";

function Home() {
  const [collapseChat, setCollapseChat] = useState(false);
  const [users, setUsers] = useState<any>([]);
  const { user: authUser } = useAuth();
  const { users: fetchedUsers } = useGetAllUsers();
  const socket = io("http://localhost:5000");
  useEffect(() => {
    socket.on("messageNotification", (data) => {
      console.log(data);
    });
  }, [socket]);
  useEffect(() => {
    if (fetchedUsers) {
      setUsers(fetchedUsers);
    }
  }, [fetchedUsers, users]);
  return (
    <div className="wrapper px-5 relative overflow-hidden ">
      <div className="container grid grid-cols-8 gap-4 min-h-screen  ">
        {/* first col , create post, posts */}

        <div
          className={cn(
            "lg:col-span-6 col-span-8 flex flex-col items-center justify-start gap-4 h-screen py-5"
          )}
        >
          <div className="create-post-posts-container w-full flex flex-col items-center gap-4 h-full overflow-y-auto">
            <div className="create-post w-1/2">
              <CreatePost />
            </div>
            <div className="posts w-full">
              <Posts />
            </div>
          </div>
        </div>

        <div className="explore-friends col-span-8 lg:col-span-2 my-10">
          <h1 className="text-2xl font-semibold my-4">Explore More People</h1>
          <div className="explore-container">
            {users
              ?.filter(({ _id }) => _id !== authUser._id)
              .map(({ _id, name, followers, createdAt, profilePic }) => (
                <Card
                  key={_id}
                  className="p-4 shadow-md rounded-lg hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="text-xl text-center font-semibold text-gray-800 border-b pb-2 mb-4 flex flex-col gap-2">
                    <div>{name}</div>
                    <div className="flex items-center  justify-center">
                      <img
                        src={profilePic ? profilePic : "/logo.jpg"}
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
                    <Button className="bg-app_primary hover:bg-app_primary/80 mt-1">
                      Follow
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </div>
        {/*  chat */}

        <motion.div
          animate={{ x: collapseChat ? "100%" : 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="lg:w-1/4 w-[90%] h-screen bg-slate-100 rounded-md p-3  absolute top-10 right-0"
        >
          <span className="collapse-chat absolute">
            {collapseChat ? (
              <IoChatbubbleEllipses
                onClick={() => setCollapseChat((prev) => !prev)}
                className="text-3xl cursor-pointer absolute right-0 top-[50%] translate-y-[-40%] left-[-40px] text-app_primary hover:scale-x-[-1] hover:transform transform scale-x-[-1] hover:scale-105 "
              />
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
    </div>
  );
}

export default Home;
