import { useAuth } from "@/Context/AuthContext";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { Card, CardHeader } from "../ui/card";
import ChatPage from "./ChatPage";
import { cn } from "@/lib/utils";
import useGetFriends from "@/hooks/api/user/useGetFriends";

const socket = io(import.meta.env.VITE_BACKEND);

export default function Chat() {
  const { user } = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [messages, setMessages] = useState<any>([]);
  const [friendsState, setFriendsState] = useState<any>([]);
  const { friends, isLoading: friendsLoading } = useGetFriends();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [openChat, setOpenChat] = useState(false);

  useEffect(() => {
    if (user?._id !== undefined || user?._id !== null) {
      socket.emit("register", user?._id);
    }
    socket.on("receiveMessage", (message) => {
      setMessages((prev: any) => [...prev, message?.newMessage]);
    });
    return () => {
      socket.off("receiveMessage");
    };
  }, [user?._id]);

  useEffect(() => {
    if (!friendsLoading) {
      setFriendsState(friends);
    }
  }, [friends, friendsLoading]);

  return (
    <div className="chat-wrapper">
      <div className="chat-container">
        <div className={cn("w-full-10")}>
          <ChatPage
            selectedUser={selectedUser}
            senderId={user?._id}
            socket={socket}
            messages={messages}
            setMessages={setMessages}
            setOpenChat={setOpenChat}
            openChat={openChat}
          />
          <div className={cn("users-container", openChat ? "hidden" : "")}>
            <h1 className="font-thin text-2xl mb-10 text-center">Chats</h1>
            <div className="users">
              {friendsLoading ? (
                // Display loading indicator while friends are being fetched
                <div className="flex justify-center items-center">
                  <span>Loading friends...</span>
                  {/* You can replace this with a spinner */}
                </div>
              ) : friendsState?.length > 0 ? (
                // Display the friends list once loading is done
                friendsState
                  ?.filter((u: any) => u?._id !== user?._id)
                  .map((user: any) => (
                    <Card
                      key={user?._id}
                      onClick={() => {
                        setSelectedUser(user);
                        setOpenChat(true);
                      }}
                      className="cursor-pointer my-5 hover:bg-slate-600/10"
                    >
                      <CardHeader>{user?.name}</CardHeader>
                    </Card>
                  ))
              ) : (
                <p className="text-center font-thin mt-32">
                  Friends you follow, and who follow you back, will be available
                  to chat.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
