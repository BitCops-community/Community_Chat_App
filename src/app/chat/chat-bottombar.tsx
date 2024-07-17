import { FileImage, Paperclip, SendHorizontal, ThumbsUp } from "lucide-react";
import { MessageType, useAppContext } from "@/app/Context/AppContext";
import Link from "next/link";
import React, { useRef, useState, useEffect } from "react";
import { Button, buttonVariants } from "../../components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Textarea } from "../../components/ui/textarea";
import { EmojiPicker } from "../../components/emoji-picker";
import { displaySooner } from "@/components/showSonner";
import xss from "xss"
import filterBadWords from "@/components/FilterBadWords";


interface ChatBottombarProps {
  sendMessage: (newMessage: MessageType) => void;
}
const urlRegex = /(\b(?:https?:\/\/)?(?:www\.)?[\w-]+\.[\w]{2,}(?:\.[\w]{2,})?\b)/gi;

export const BottombarIcons = [{ icon: FileImage }, { icon: Paperclip }];

export default function ChatBottombar({ sendMessage }: ChatBottombarProps) {
  const [message, setMessage] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { user, messages } = useAppContext();

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isButtonDisabled) {
      setCountdown(3);
      timer = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            clearInterval(timer);
            setIsButtonDisabled(false);
            return 0;
          }
          return prevCountdown - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isButtonDisabled]);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  const handleThumbsUp = () => {
    let message1 = message.trim()
    if (urlRegex.test(message1)) {
      if (!user?.isAdmin) {
        displaySooner("Your message contains a URL, which is not allowed.");
        return;
      }
    }
    const newMessage: MessageType = {
      id: messages.length + 1,
      senderId: user!.id.toString(),
      name: user!.name,
      avatar: user!.avatar,
      message: "👍",
      createdAt: Date.now().toString(),
    };

    sendMessage(newMessage);
    setMessage("");
    setIsButtonDisabled(true);
  };

  const handleSend = () => {
    if (message.trim()) {

      let message1 = xss(message.trim())
      if (urlRegex.test(message1)) {
        if (!user?.isAdmin) {
          displaySooner("Your message contains a URL, which is not allowed.");
          return;
        }
      }
      message1 = filterBadWords(message1)
      const newMessage: MessageType = {
        id: message.length + 1,
        senderId: user!.id.toString(),
        name: user!.name,
        avatar: user!.avatar,
        message: message1,
        createdAt: Date.now().toString(),
      };

      sendMessage(newMessage);
      setMessage("");
      setIsButtonDisabled(true);

      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }

    if (event.key === "Enter" && event.shiftKey) {
      event.preventDefault();
      setMessage((prev) => prev + "\n");
    }
  };



  const [file, setFile] = useState<File | undefined>()

  const setFileData = (e: React.ChangeEvent<HTMLInputElement> | null) => {
    if (e?.target?.files && e.target.files.length > 0) {
      setFile(e.target.files[0])

    }
  }

  return (
    <div className="p-2 flex justify-between w-full items-center gap-2">
      <AnimatePresence initial={false}>
        {/* {user?.isAdmin && (
          <>
            <div className="cursor-pointer">
              <Button className="p-1 cursor-pointer" variant={"outline"}>
                <Label htmlFor="imageInput" className="cursor-pointer">
                  <FileImage />
                </Label>
                <input id="imageInput" onChange={setFileData} type="file" className="opacity-1 right-0 absolute top-3" />
              </Button>
            </div>
          </>
        )} */}
        <motion.div
          key="input"
          className="w-full relative"
          layout
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{
            opacity: { duration: 0.05 },
            layout: {
              type: "spring",
              bounce: 0.15,
            },
          }}
        >
          <Textarea
            autoComplete="off"
            value={message}
            ref={inputRef}
            onKeyDown={handleKeyPress}
            onChange={handleInputChange}
            name="message"
            placeholder="Aa"
            className=" w-full pr-[25px] border rounded-full flex items-center h-9 resize-none overflow-hidden bg-background"
            disabled={isButtonDisabled}
          ></Textarea>
          <div className="absolute right-2 bottom-0.5">
            <EmojiPicker
              onChange={(value) => {
                setMessage(message + value);
                if (inputRef.current) {
                  inputRef.current.focus();
                }
              }}
            />
          </div>
        </motion.div>

        {message.trim() ? (
          <Link
            href="#"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "h-9 w-9",
              "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white shrink-0"
            )}
            onClick={handleSend}
            style={{ pointerEvents: isButtonDisabled ? "none" : "auto" }}
          >
            {isButtonDisabled ? (
              <span>{countdown}s</span>
            ) : (
              <SendHorizontal size={20} className="text-muted-foreground" />
            )}
          </Link>
        ) : (
          <Link
            href="#"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "h-9 w-9",
              "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white shrink-0"
            )}
            onClick={handleThumbsUp}
            style={{ pointerEvents: isButtonDisabled ? "none" : "auto" }}
          >
            {isButtonDisabled ? (
              <span>{countdown}s</span>
            ) : (
              <ThumbsUp size={20} className="text-muted-foreground" />
            )}
          </Link>
        )}
      </AnimatePresence>
    </div>
  );
}
