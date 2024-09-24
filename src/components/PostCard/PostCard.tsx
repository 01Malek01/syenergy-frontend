import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { motion } from "framer-motion";
import { formatDate } from "@/utils";
import { SlLike } from "react-icons/sl";
import { FaRegShareSquare } from "react-icons/fa";
import { FaRegCommentAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import useLike from "@/hooks/api/post/useLike";
import useDislike from "@/hooks/api/post/useDislike";
import Comments from "../Comments/Comments";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/Context/AuthContext";

type Props = {
  title: string;
  content: string;
  author: string;
  publishDate: string;
  likes: [string];
  postId?: string;
  authorId: string;
  likesCount?: number;
};

export default function PostCard({
  title,
  content,
  author,
  publishDate,
  likes,
  postId,
  authorId,
  likesCount,
}: Props) {
  const [liked, setLiked] = useState(false);
  const { likePost } = useLike();
  const { dislikePost } = useDislike();
  const [postLikes, setPostLikes] = useState(likesCount || 0);
  const [showComments, setShowComments] = useState(false);
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (likes.includes(authUser._id)) {
      setLiked(true);
    }
  }, [authUser, likes]);
  return (
    <Card className="w-full p-4 shadow-md space-y-8 mb-16 ">
      <CardHeader>
        <CardTitle className="text-3xl font-extrabold">{title}</CardTitle>
        <CardDescription
          onClick={() => navigate(`/users/${authorId}/profile`)}
          className="font-semibold text-xs cursor-pointer"
        >
          {author}
        </CardDescription>
      </CardHeader>

      <CardContent>{content}</CardContent>
      <CardFooter className="flex justify-between  ">
        <div className="text-xs font-thin order-1 self-end ">
          published {formatDate(publishDate)}
        </div>
        {/* interactions section */}
        <div className="flex flex-col gap-5 justify-center ">
          <div className="flex space-x-10 border shadow-lg p-2 justify-start rounded-md w-fit">
            <button
              onClick={() => {
                setLiked((prev) => !prev);
                if (liked) {
                  setPostLikes((prev) => prev - 1);
                  dislikePost(postId);
                } else {
                  setPostLikes((prev) => prev + 1);
                  likePost(postId);
                }
              }}
              className={cn("flex items-center justify-center self-start")}
            >
              <SlLike className={cn({ "text-app_primary": liked })} size={20} />{" "}
              <span className={cn("ml-1")}>{postLikes}</span>
            </button>
            <button className="flex items-center justify-center ">
              <FaRegShareSquare size={20} />
            </button>
            <button
              onClick={() => setShowComments((prev) => !prev)}
              className="flex items-center justify-center "
            >
              <FaRegCommentAlt size={20} />
            </button>
          </div>
        </div>
      </CardFooter>
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className={cn(
          "comments-section flex items-center justify-center flex-col",
          {
            hidden: !showComments,
          }
        )}
      >
        <Comments postId={postId} />
      </motion.div>
    </Card>
  );
}
