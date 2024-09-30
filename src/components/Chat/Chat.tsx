import { useAuth } from "@/Context/AuthContext";
import { useEffect, useState } from "react";
import { Card, CardHeader } from "../ui/card";
import ChatPage from "./ChatPage";
import { cn } from "@/lib/utils";
import useGetFriends from "@/hooks/api/user/useGetFriends";
import { useSocket } from "@/Context/SocketContext";

export default function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any>([]);
  const [friendsState, setFriendsState] = useState<any>([]);
  const { friends, isLoading: friendsLoading } = useGetFriends();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [openChat, setOpenChat] = useState(false);
  const [newMessages, setNewMessages] = useState<
    { sender: string; content: string }[]
  >([]);
  const { socket } = useSocket();

  useEffect(() => {
    if (!friendsLoading) {
      setFriendsState(friends);
    }
  }, [friends, friendsLoading]);

  useEffect(() => {
    if (socket) {
      socket.on("receiveMessage", (message) => {
        if (message.sender !== selectedUser?._id) {
          // Only track new messages if it's from a different user than the one you're currently chatting with
          setNewMessages((prev) => [...prev, message]);
        } else {
          // If the message is from the selected user, add it directly to the chat
          setMessages((prevMessages) => [...prevMessages, message]);
        }
      });
    }

    return () => {
      socket?.off("receiveMessage");
    };
  }, [socket, selectedUser]);

  const removeNotification = (senderId: string) => {
    setNewMessages((prevMessages) =>
      prevMessages.filter((message) => message.sender !== senderId)
    );
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-container">
        <div className={cn("w-full-10")}>
          <ChatPage
            selectedUser={selectedUser}
            senderId={user?._id}
            messages={messages}
            setMessages={setMessages}
            setOpenChat={setOpenChat}
            openChat={openChat}
          />
          <div className={cn("users-container", openChat ? "hidden" : "")}>
            <h1 className="font-thin text-2xl mb-10 text-center">Chats</h1>
            <div className="users">
              {friendsLoading ? (
                <div className="flex justify-center items-center">
                  <span>Loading friends...</span>
                </div>
              ) : friendsState?.length > 0 ? (
                friendsState
                  ?.filter((u: any) => u?._id !== user?._id)
                  .map((friend: any) => (
                    <Card
                      key={friend?._id}
                      onClick={() => {
                        setSelectedUser(friend);
                        setOpenChat(true);
                        removeNotification(friend?._id); // Remove notification when opening chat with the user
                      }}
                      className="cursor-pointer my-5 hover:bg-slate-600/10"
                    >
                      <CardHeader>{friend?.name}</CardHeader>
                      <span>
                        {newMessages.some((m) => m.sender === friend?._id)
                          ? "New message"
                          : ""}
                      </span>
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
