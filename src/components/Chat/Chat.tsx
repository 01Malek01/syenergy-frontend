import { useAuth } from "@/Context/AuthContext";
import useGetAllUsers from "@/hooks/api/chat/useGetAllUsers";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { Card, CardHeader } from "../ui/card";
const socket = io("http://localhost:5000");
export default function Chat() {
  const { user } = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [messages, setMessages] = useState<any>([]);
  const [usersState, setUsersState] = useState<any>([]);
  const { users, isLoading } = useGetAllUsers();
  useEffect(() => {
    if (user?._id !== undefined || user?._id !== null) {
      socket.emit("register", user?._id);
    }
    socket.on("receiveMessage", (message) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setMessages((prev: any) => [...prev, message]);
    });
    return () => {
      socket.off("receiveMessage");
    };
  }, [user?._id]);

  useEffect(() => {
    if (!isLoading) {
      setUsersState(users);
    }
  }, [users, isLoading]);
  return (
    <div className="chat-wrapper">
      <div className="chat-container">
        <h1 className="font-thin text-2xl mb-10 text-center">Chats</h1>
        <div className="users">
          {usersState
            ?.filter((u: any) => u?._id !== user?._id)
            .map((user: any) => (
              <Card className="cursor-pointer my-5 hover:bg-slate-600/10">
                <CardHeader>{user?.name}</CardHeader>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
