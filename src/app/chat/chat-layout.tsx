"use client";
import { userData } from "@/app/data";
import React, { useEffect, useState } from "react";
import { Chat } from "./chat";
import { useAppContext } from "@/app/Context/AppContext";
import { useRouter } from "next/navigation";

export function ChatLayout() {
  const { user } = useAppContext();

  const {
    loggedIn,
    token,
    isCounted,
    setIsCounted,
    messages,
    sendMessage,
    socket,
  } = useAppContext();

  const router = useRouter();
  useEffect(() => {
    if (!loggedIn) {
      router.push("/auth/signin");
    }
  }, [loggedIn, router]);

  useEffect(() => {
    if (socket && loggedIn && !isCounted) {
      socket.emit("userJoined", { token });
      setIsCounted(true);
    }
  }, [isCounted, loggedIn, setIsCounted, socket, token]);

  if (!loggedIn)
    return (
      <>
        <div className="h-[100%] bg-transparent flex w-[100%] items-center justify-center">
          <h3>Please Wait</h3>
        </div>
      </>
    );
  return (
    <>
      <Chat
        sendMessage={sendMessage}
        messages={messages}
        selectedUser={user!}
      />
      <audio src="/alertRing.mp3" id="notiAudio" />
    </>
  );
}
