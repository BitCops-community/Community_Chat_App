"use client"
import { displaySooner } from "@/components/showSonner";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

import { Socket, io } from "socket.io-client"

export interface UserType {
    id: string;
    name: string;
    avatar: string;
    isAdmin: boolean;
}

export interface MessageType {
    id: number;
    senderId: string;
    avatar: string;
    name: string;
    message: string;
    createdAt?: string
}


interface AppContextTypes {
    user: UserType | null;
    setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
    token: string | null;
    loggedIn: boolean
    setToken: (token: string) => void;
    setLoggedIn: (value: boolean) => void;
    messages: MessageType[];
    sendMessage: (newMessage: MessageType) => void;
    socket: Socket | null;
    liveUsers: number;
    setMessages: (message: MessageType[]) => void;
    messageHeights: number[];
    setMessageHeights: (newHeights: number[]) => void;
    replaceUrlsWithLinks: (message: string) => string;
}

const AppContext = createContext<AppContextTypes | undefined>(undefined);
const replaceUrlsWithLinks = (text: string) => {
    const urlRegex = /((https?:\/\/)?(\w+(\.\w+)+)(\/[\w#&?=%.+-]*)?)/g;
    return text.replace(urlRegex, (url) => {
        let hyperlink = url;
        if (!hyperlink.startsWith("http")) {
            hyperlink = "http://" + hyperlink;
        }
        return `<a href="${hyperlink}" target="_blank" rel="noopener noreferrer" class="text-blue-500 underline">${url}</a>`;
    });
};

function calculateSingleMessageHeight(message: MessageType, selectedUser: UserType | null): number {
    // Create a temporary div to measure message height
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = `
      <div class="flex gap-3 items-center">
        ${message.senderId !== selectedUser!.id ? `
          <div class="flex justify-center items-center">
            <img src="${message.avatar}" alt="${message.name}" width="6" height="6" />
          </div>
        ` : ''}
        <span class="bg-accent p-3 rounded-md max-w-xs">
          <small>${message.name}</small><br />
          ${replaceUrlsWithLinks(message.message)}<br />
          <small>${message.createdAt}</small>
        </span>
        ${message.senderId === selectedUser!.id ? `
          <div class="flex justify-center items-center">
            <img src="${message.avatar}" alt="${message.name}" width="6" height="6" />
          </div>
        ` : ''}
      </div>
    `;
    document.body.appendChild(tempDiv);
    // Get the height of the temporary div
    const height = tempDiv.offsetHeight;
    // Remove the temporary div from the DOM
    document.body.removeChild(tempDiv);

    return height;
}


export const ContextProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserType | null>(null);
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [token, setToken] = useState<string | null>(null);
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [liveUsers, setLiveUsers] = useState<number>(1)

    const [messageHeights, setMessageHeights] = React.useState<number[]>([]);

    const sendMessage = async (message: MessageType) => {
        let newMessageHeight = calculateSingleMessageHeight(message, user);
        setMessageHeights((prev) => [...prev, newMessageHeight]);

        setMessages((prev) => [...prev, message]);

        if (socket) {
            socket?.emit("message", { token: token, message })
        }
    }


    const values = {
        user,
        loggedIn,
        setLoggedIn,
        setUser,
        token,
        setToken,
        messages,
        sendMessage,
        socket,
        liveUsers,
        setMessages,
        messageHeights,
        setMessageHeights,
        replaceUrlsWithLinks
    };

    useEffect(() => {
        const url = process.env.NODE_ENV === 'production' ? 'https://community-chat-app-backend.onrender.com' : 'http://localhost:3002';
        const socket = io(url);

        // Listeners
        socket.on('connect', () => {
            setSocket(socket);
            console.log('Connected to socket server');
            displaySooner("Connected to socket server");
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from socket server');
        });

        socket.on('message', (newMessage: MessageType) => {
            setMessages(prevMessages => [...prevMessages, newMessage]);
        });

        socket.on("connectedUsers", (data) => {
            setLiveUsers(data);
        })

        // Cleanup
        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('message');
            socket.off('messages');
            socket.close();
        };
    }, []);

    return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextTypes => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within a ContextProvider");
    }
    return context;
};
