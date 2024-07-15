
import ChatTopbar from "./chat-topbar";
import { ChatList } from "./chat-list";
import React from "react";
import { MessageType, UserType } from "@/app/Context/AppContext";
import Credit from "@/components/Credit";


interface ChatProps {
  messages?: MessageType[];
  selectedUser: UserType;
  sendMessage: (newMessage: MessageType) => void;
}

export function Chat({ messages, selectedUser, sendMessage }: ChatProps) {


  return (
    <div className="flex flex-col justify-between w-full h-full">
      <ChatTopbar />

      <ChatList
        messages={messages}
        selectedUser={selectedUser}
        sendMessage={sendMessage}
      />
      <Credit />
    </div>
  );
}
