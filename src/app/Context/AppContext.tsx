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
}

const AppContext = createContext<AppContextTypes | undefined>(undefined);



const getMessages = async (setMessages: (messages: MessageType[]) => void) => {

}

export const ContextProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserType | null>(null);
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [token, setToken] = useState<string | null>(null);
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [liveUsers, setLiveUsers] = useState<number>(0)
    const sendMessage = (message: MessageType) => {
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
        setMessages
    };

    useEffect(() => {
        const url = process.env.NODE_ENV === 'production' ? 'http://localhost:3001' : 'http://localhost:3002';
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
