import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { formatDate } from "@/utils";
import { SlLike } from "react-icons/sl";
import { FaRegShareSquare, FaRegCommentAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import useLike from "@/hooks/api/post/useLike";
import useDislike from "@/hooks/api/post/useDislike";
import Comments from "../Comments/Comments";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/Context/AuthContext";
import useSharePost from "@/hooks/api/post/useSharePost";
import { toast } from "react-toastify";

// Define the props type
type Props = {
  title: string;
  content: string;
  author: string;
  publishDate: string;
  likes: string[]; // Changed from [string] to string[]
  postId: string;
  authorId: string;
  likesCount?: number;
  isShared?: boolean;
  sharedFrom?: string;
};

export default function PostCard({
  title,
  content,
  author,
  publishDate,
  likes,
  postId,
  authorId,
  isShared,
  sharedFrom,
}: Props) {
  const [liked, setLiked] = useState(false);
  const { likePost } = useLike();
  const { dislikePost } = useDislike();
  const [postLikes, setPostLikes] = useState(likes?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const { isError, sharePost, isSuccess } = useSharePost();

  // Function to handle sharing a post
  const sharePostHandler = () => {
    if (authUser) {
      sharePost({ postId: postId || "" });
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Post shared successfully");
    }
    if (isError) {
      toast.error("Something went wrong");
    }
  }, [isSuccess, isError]);

  useEffect(() => {
    if (authUser && likes.includes(authUser._id as string)) {
      setLiked(true);
    }
  }, [authUser, likes]);

  return (
    <Card className="w-full p-4 shadow-md space-y-8 mb-16">
      <CardHeader>
        <CardTitle className="md:text-3xl font-extrabold text-xl">
          {title}
        </CardTitle>
        <CardDescription
          onClick={() => navigate(`/users/${authorId}/profile`)}
          className="font-semibold text-xs cursor-pointer"
        >
          <span>{author}</span>
          {isShared && (
            <span className="text-sm font-thin">
              {" "}
              shared a post from {sharedFrom}
            </span>
          )}
        </CardDescription>
      </CardHeader>

      <CardContent className="text-sm md:text-lg">{content}</CardContent>
      <CardFooter className="flex justify-between">
        <div className="lg:text-sm text-[10px] ml-2 tracking-tight font-thin order-1 self-end">
          published {formatDate(publishDate)}
        </div>
        {/* Interactions section */}
        <div className="flex flex-col gap-5 justify-center">
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
              <SlLike className={cn({ "text-app_primary": liked })} size={20} />
              <span className={cn("ml-1")}>{postLikes}</span>
            </button>
            <button
              onClick={sharePostHandler}
              className="flex items-center justify-center"
            >
              <FaRegShareSquare size={20} />
            </button>
            <button
              onClick={() => setShowComments((prev) => !prev)}
              className="flex items-center justify-center"
            >
              <FaRegCommentAlt size={20} />
            </button>
          </div>
        </div>
      </CardFooter>
      <div
        className={cn(
          "comments-section flex items-center justify-center flex-col",
          {
            hidden: !showComments,
          }
        )}
      >
        <Comments postId={postId} />
      </div>
    </Card>
  );
}
