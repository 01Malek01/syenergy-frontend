import { IoChatbubbleEllipses } from "react-icons/io5";
import Chat from "@/components/Chat/Chat";
import CreatePost from "@/components/CreatePost/CreatePost";
import Posts from "@/components/Posts/Posts";
import { useState } from "react";
import "react-resizable/css/styles.css"; // Import the necessary styles for resizing
import { motion } from "framer-motion";
import { FaArrowCircleRight } from "react-icons/fa";
import { cn } from "@/lib/utils";

function Home() {
  const [collapseChat, setCollapseChat] = useState(false);
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

        {/* second col , message */}

        <motion.div
          animate={{ x: collapseChat ? "100%" : 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="lg:w-1/4 w-[90%] h-screen bg-slate-100 rounded-md p-3 lg:col-span-2  absolute top-10 right-0"
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
