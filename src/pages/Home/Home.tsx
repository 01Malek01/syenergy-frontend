import Chat from "@/components/Chat/Chat";
import CreatePost from "@/components/CreatePost/CreatePost";
import Posts from "@/components/Posts/Posts";
import "react-resizable/css/styles.css"; // Import the necessary styles for resizing
import { ResizableBox } from "react-resizable";

function Home() {
  return (
    <div className="wrapper px-5">
      <div className="container grid grid-cols-8 gap-4 min-h-screen">
        {/* first col , create post, posts */}
        <div className="col-span-6 flex flex-col items-center justify-start gap-4 h-screen">
          <div className="create-post-posts-container w-full flex flex-col items-center gap-4 h-full overflow-y-auto">
            <div className="create-post w-1/2">
              <CreatePost />
            </div>
            <div className="posts w-full">
              <Posts />
            </div>
          </div>
        </div>
        {/* third col , message */}
        <ResizableBox
          width={300}
          height={800}
          minConstraints={[200, 300]}
          maxConstraints={[600, 1200]}
          axis="x"
          className="message col-span-2 w-full h-screen bg-app_primary flex items-center justify-center rounded-md"
          handle={
            <div className="w-2 h-full bg-slate-400 hover:bg-gray-500 rounded-full cursor-col-resize" />
          }
        >
          <div className="w-full h-full bg-slate-100 rounded-md p-3">
            <Chat />
          </div>
        </ResizableBox>
      </div>
    </div>
  );
}

export default Home;
