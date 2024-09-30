import { useForm } from "react-hook-form";
import { Card } from "../ui/card";
import { Form, FormField, FormItem } from "../ui/form";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { IoSend } from "react-icons/io5";
import useSendMessage from "@/hooks/api/chat/useSendMessage";
import useGetMessages from "@/hooks/api/chat/useGetMessages";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/Context/AuthContext";
import { useSocket } from "@/Context/SocketContext";

export default function ChatPage({
  selectedUser,
  messages,
  setOpenChat,
  openChat,
  setMessages,
}: {
  socket: any;
  senderId: string;
  selectedUser: {
    name: string;
    _id: string;
    email: string;
    profilePicture: string;
  };
  messages: any;
  setMessages: any;
  setOpenChat: any;
  openChat: boolean;
}) {
  const form = useForm({ initialValues: { message: "" } });
  const messagesEnd = useRef<HTMLDivElement>(null);
  const { user: authUser } = useAuth();
  const { handleSubmit, register, reset } = form;
  const { sendMessage } = useSendMessage();
  const { messages: fetchedMessages, isLoading } = useGetMessages(
    selectedUser?._id
  );
  const { socket } = useSocket();
  const sendMessageHandler = async function (message: string) {
    reset();
    const res = await sendMessage({
      receiverId: selectedUser?._id,
      content: message?.message,
    });
    setMessages((prev: any) => [...prev, res.message]);
    scrollIntoView();
  };

  const scrollIntoView = () => {
    if (messagesEnd.current) {
      messagesEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  useEffect(() => {
    socket?.on("receiveMessage", (message) => {
      setMessages((prev: any) => [...prev, message]);
    });
  }, [socket]);
  useEffect(() => {
    if (fetchedMessages) {
      setMessages(fetchedMessages?.messages);
    }
  }, [fetchedMessages, selectedUser?.name, setMessages]);

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
            messages?.map((message: any, index: number) => (
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
