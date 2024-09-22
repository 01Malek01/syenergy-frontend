import { useAuth } from "@/Context/AuthContext";
import useGetAllUsers from "@/hooks/api/chat/useGetAllUsers";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { Card, CardHeader } from "../ui/card";
import ChatPage from "./ChatPage";
import { cn } from "@/lib/utils";
const socket = io("http://localhost:5000");
export default function Chat() {
  const { user } = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [messages, setMessages] = useState<any>([]);
  const [usersState, setUsersState] = useState<any>([]);
  const { users, isLoading } = useGetAllUsers();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [openChat, setOpenChat] = useState(false);
  useEffect(() => {
    if (user?._id !== undefined || user?._id !== null) {
      socket.emit("register", user?._id);
    }
    socket.on("receiveMessage", (message) => {
      // console.log("receive message", message);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setMessages((prev: any) => [...prev, message?.newMessage]);
    });
    return () => {
      socket.off("receiveMessage");
    };
  }, [user?._id, socket, messages]);

  useEffect(() => {
    if (!isLoading) {
      setUsersState(users);
    }
  }, [users, isLoading]);
  return (
    <div className="chat-wrapper  ">
      <div className="chat-container  ">
        <div className={cn("w-full-10 ")}>
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
              {usersState
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
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
