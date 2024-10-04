import { useAuth } from "@/Context/AuthContext";
import useGetMessages from "@/hooks/api/chat/useGetMessages";
import useSendMessage from "@/hooks/api/chat/useSendMessage";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { IoSend } from "react-icons/io5";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Form, FormField, FormItem } from "../ui/form";
import { Textarea } from "../ui/textarea";
import { useSocket } from "@/Context/SocketContext";
import { User } from "types";

interface ChatPageProps {
  selectedUser: User | null;
  setOpenChat: (open: boolean) => void;
  openChat: boolean;
  senderId: string;
}

interface Message {
  sender: string;
  content: string;
}

export default function ChatPage({
  selectedUser,
  setOpenChat,
  openChat,
}: ChatPageProps) {
  const form = useForm<{ message: string }>({ defaultValues: { message: "" } });
  const messagesEnd = useRef<HTMLDivElement>(null);
  const { user: authUser } = useAuth();
  const { handleSubmit, register, reset } = form;
  const { sendMessage } = useSendMessage();
  const { socket } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);

  const { messages: fetchedMessages, isLoading } = useGetMessages(
    selectedUser?._id as string
  );

  const sendMessageHandler = async (data: { message: string }) => {
    reset();
    const res = await sendMessage({
      receiverId: selectedUser?._id as string,
      content: data.message,
    });
    setMessages((prev) => [...prev, res.message]);
    scrollIntoView();
  };

  useEffect(() => {
    const handleReceiveMessage = (message: { newMessage: Message }) => {
      setMessages((prev) => [...prev, message.newMessage]);
    };

    socket?.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket?.off("receiveMessage", handleReceiveMessage);
    };
  }, [socket]);

  useEffect(() => {
    if (fetchedMessages) {
      setMessages(fetchedMessages?.messages);
    }
  }, [fetchedMessages]);

  const scrollIntoView = () => {
    if (messagesEnd.current) {
      messagesEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollIntoView();
  }, [messages, openChat]);

  return (
    openChat && (
      <div className="flex flex-col gap-4  relative">
        <div className="flex-col flex gap-4 overflow-y-auto h-[70vh]">
          <h1 className="font-thin text-2xl mb-10 text-center">
            You're Chatting with <br />
            {selectedUser?.name}
          </h1>

          {isLoading ? (
            <div className="loading text-4xl text-center mt-20 font-semibold">
              Loading...
            </div>
          ) : (
            messages?.map((message, index) => (
              <Card
                key={index}
                className={cn("sent p-2", {
                  "self-start bg-app_primary/90 my-1":
                    message?.sender === authUser?._id,
                  "self-end": message?.sender !== authUser?._id,
                })}
              >
                <p>{message?.content}</p>
              </Card>
            ))
          )}
          {/* Dummy div to scroll to (no longer hidden) */}
          <div ref={messagesEnd}></div>
        </div>
        <Form {...form}>
          <form
            onSubmit={handleSubmit(sendMessageHandler)}
            className="flex justify-start w-full items-center"
          >
            <FormItem className="flex-1">
              <FormField
                name="message"
                render={() => (
                  <Textarea
                    className="max-w-[500px] min-w-[200px]"
                    {...register("message")}
                    placeholder="Type something"
                  />
                )}
              />
            </FormItem>
            <Button className="self-end ml-5" type="submit">
              <IoSend className="text-2xl" />
            </Button>
          </form>
        </Form>
        <Button
          className=" top-52 right-[19rem] opacity-75"
          onClick={() => setOpenChat(false)}
        >
          Back
        </Button>
      </div>
    )
  );
}
