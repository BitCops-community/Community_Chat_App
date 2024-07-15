
import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";
import { Avatar, AvatarImage } from "../../components/ui/avatar";
import ChatBottombar from "./chat-bottombar";
import { AnimatePresence, motion } from "framer-motion";
import { MessageType, useAppContext, UserType } from "@/app/Context/AppContext";

interface ChatListProps {
  messages?: MessageType[];
  selectedUser: UserType;
  sendMessage: (newMessage: MessageType) => void;
}

function formatTimestampToHumanReadable(timestamp: string | number | undefined): string {
  if (!timestamp) {
    return "Invalid date";
  }

  let date: Date;

  // Check if the timestamp is a number or a string representation of a number
  if (typeof timestamp === "number" || !isNaN(Number(timestamp))) {
    date = new Date(Number(timestamp));
  } else if (typeof timestamp === "string") {
    date = new Date(timestamp);
  } else {
    return "Invalid date";
  }

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return "Invalid date";
  }

  // Define options for formatting the date
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true, // Use 12-hour time format
    timeZoneName: 'short', // Include the time zone abbreviation
  };

  // Format the date using the specified options
  const formattedDate = date.toLocaleDateString('en-US', options);

  return formattedDate;
}



export function ChatList({
  messages,
  selectedUser,
  sendMessage
}: ChatListProps) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { token, loggedIn, setMessages } = useAppContext();
  React.useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const getMessages = async () => {
    const req = await fetch("/api/v1/messages/get", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        recipientId: selectedUser.id
      })
    })

    const res: { success: boolean; messages: MessageType[] } = await req.json();
    return res
  }

  useEffect(() => {
    if (token && loggedIn) {
      getMessages().then((res: { success: boolean; messages: MessageType[] }) => {
        console.log(res);

        if (res.success) {
          setMessages(res.messages)
        }
      })
    }
  }, []);

  return (
    <div className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col">
      <div
        ref={messagesContainerRef}
        className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col"
      >
        <AnimatePresence>
          {messages?.map((message, index) => (
            <motion.div
              key={index}
              layout
              initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
              transition={{
                opacity: { duration: 0.1 },
                layout: {
                  type: "spring",
                  bounce: 0.3,
                  duration: messages.indexOf(message) * 0.05 + 0.2,
                },
              }}
              style={{
                originX: 0.5,
                originY: 0.5,
              }}
              className={cn(
                "flex flex-col gap-2 p-4 whitespace-pre-wrap",
                message.senderId === selectedUser.id ? "items-end" : "items-start"
              )}
            >
              <div className="flex gap-3 items-center">
                {message.senderId !== selectedUser.id && (
                  <Avatar className="flex justify-center items-center">
                    <AvatarImage
                      src={message.avatar}
                      alt={message.name}
                      width={6}
                      height={6}
                    />
                  </Avatar>
                )}
                <span className="bg-accent p-3 rounded-md max-w-xs">
                  <small>{message.name}</small>
                  <br />
                  {message.message}
                  <br />
                  <small>{formatTimestampToHumanReadable(message.createdAt)}</small>
                </span>

                {message.senderId === selectedUser.id && (
                  <Avatar className="flex justify-center items-center">
                    <AvatarImage
                      src={message.avatar}
                      alt={message.name}
                      width={6}
                      height={6}
                    />
                  </Avatar>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <ChatBottombar sendMessage={sendMessage} />
    </div>
  );
}
