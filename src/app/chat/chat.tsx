
import ChatTopbar from "./chat-topbar";
import { ChatList } from "./chat-list";
import React from "react";
import { MessageType, UserType } from "@/app/Context/AppContext";

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
      <div className="flex items-center justify-around" style={{ textAlign: 'center', paddingTop: '5px', borderTop: '1px solid #ddd' }}>
        <p className="mb-0">
          Created by <a href="https://github.com/fhackker" target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', textDecoration: 'none' }}>Faisal Shahzad (Fhackker)</a>
        </p>
      </div>

    </div>
  );
}
