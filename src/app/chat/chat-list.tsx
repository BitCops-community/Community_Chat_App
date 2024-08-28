import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { Avatar, AvatarImage } from "../../components/ui/avatar";
import ChatBottombar from "./chat-bottombar";
import { motion } from "framer-motion";
import { MessageType, useAppContext, UserType } from "@/app/Context/AppContext";
import { AutoSizer, List } from "react-virtualized";
import xss from "xss";
import { displaySooner } from "@/components/showSonner";
import UserProfile from "@/components/UserProfile";

interface ChatListProps {
  messages?: MessageType[];
  selectedUser: UserType;
  sendMessage: (newMessage: MessageType) => void;
}




export function ChatList({
  messages,
  selectedUser,
  sendMessage
}: ChatListProps) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { alertMe, token, loggedIn, setMessages, messageHeights, setMessageHeights, replaceUrlsWithLinks, formatTimestampToHumanReadable } = useAppContext();
  const [showProfile, setShowProfile] = useState<{ open: boolean; id: string }>({
    open: false,
    id: ""
  });

  const listRef = useRef<List>(null); // Ref to the List component
  React.useEffect(() => {
    if (listRef.current) {
      // Scroll to the bottom when messages change
      listRef.current.scrollToRow(messages?.length! - 1)
    }
  }, [messages]);


  React.useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
    if (alertMe) {
      if (messages![messages?.length! - 1]?.senderId === selectedUser?.id) {

      } else {

        const audio = document.getElementById('notiAudio') as HTMLAudioElement;
        if (audio) audio.play();
      }
    }
  }, [alertMe, messages, selectedUser?.id]);

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
    });

    const res: { success: boolean; messages: MessageType[] } = await req.json();
    return res;
  };

  useEffect(() => {
    if (token && loggedIn) {
      getMessages().then((res: { success: boolean; messages: MessageType[] }) => {
        if (res.success) {
          setMessages(res.messages);
        }
      });
    }
  }, []);

  const calculateMessageHeights = (messages: MessageType[]) => {
    const heights: number[] = [];

    messages.forEach((message) => {
      // Create a temporary div to measure message height
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = `
        <div class="flex gap-3 items-center">
          ${message.senderId !== selectedUser.id ? `
            <div class="flex justify-center items-center">
              <img src="${message.avatar}" alt="${message.name}" width="6" height="6" />
            </div>
          ` : ''}
          <span class="bg-accent p-3 rounded-md max-w-xs">
            <small>${message.name}</small><br />
            ${replaceUrlsWithLinks(message.message)}<br />
            <small>${formatTimestampToHumanReadable(message.createdAt)}</small>
          </span>
          ${message.senderId === selectedUser.id ? `
            <div class="flex justify-center items-center">
              <img src="${message.avatar}" alt="${message.name}" width="6" height="6" />
            </div>
          ` : ''}
        </div>
      `;

      document.body.appendChild(tempDiv);
      // Get the height and store it
      const height = tempDiv.offsetHeight;
      heights.push(height);
      // Remove the temporary div
      document.body.removeChild(tempDiv);
    });

    return heights;
  };

  useEffect(() => {
    if (messages) {
      const heights = calculateMessageHeights(messages);
      setMessageHeights(heights);
      setTimeout(() => {
        if (listRef.current) {
          // Scroll to the bottom when messages change
          listRef.current.scrollToRow(messages?.length! - 1)
        }
      }, 2000);
    }
  }, [messages]);

  const rowRenderer = ({ index, key, style }: any) => {
    const message = messages![index];

    return (
      <motion.div
        key={key}
        layout
        initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
        animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
        exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
        transition={{
          opacity: { duration: 0.1 },
          layout: {
            type: "spring",
            bounce: 0.3,
            duration: 1.1,
          },
        }}
        style={{
          ...style,
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
            <Avatar className="flex cursor-pointer justify-center items-center">
              <AvatarImage className="cursor-pointer"
                style={{ cursor: "pointer" }}
                title={message?.name}
                onClick={() => setShowProfile((prev) => ({ ...prev, open: true, id: message.senderId }))}
                src={message.avatar}
                alt={message.name}
                width={6}
                height={6}
              />
            </Avatar>
          )}
          <span className="bg-accent p-3 rounded-md max-w-xs" style={{ overflowWrap: "anywhere" }}>
            <small>{message.name}</small>
            <br />
            <span className="mb-3"
              dangerouslySetInnerHTML={{
                __html: replaceUrlsWithLinks(xss(message.message)),
              }}
            />
            <br />
            <small>{formatTimestampToHumanReadable(message.createdAt)}</small>
          </span>

          {message.senderId === selectedUser.id && (
            <Avatar className="flex justify-center items-center">
              <AvatarImage
                src={message.avatar}
                alt={message.name}
                onClick={() => setShowProfile((prev) => ({ ...prev, open: true, id: message.senderId }))}
                width={6}
                height={6}
              />
            </Avatar>
          )}
        </div>
      </motion.div>
    );
  };
  if (messageHeights.length === 0) {
    return null;
  }
  return (
    <div ref={messagesContainerRef} className="w-full top-header overflow-y-auto overflow-x-hidden h-[95%] flex flex-col">
      <AutoSizer disableHeight>
        {({ width }) => (
          <List
            ref={listRef}
            width={width}
            height={(messagesContainerRef.current?.clientHeight! - 52) || 700} // Adjust the height as needed
            rowCount={messages!.length}
            rowHeight={({ index }) => messageHeights[index]}
            rowRenderer={rowRenderer}
            style={{ outline: "none" }}
          />
        )}
      </AutoSizer>
      <UserProfile setShowProfile={setShowProfile} showProfile={showProfile} />
      <ChatBottombar sendMessage={sendMessage} />
    </div>
  );
}
