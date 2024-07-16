import { ChatLayout } from "@/app/chat/chat-layout";

export default function Home() {


  return (
    <main className="flex h-[calc(100dvh)] flex-col items-center justify-center ">

      <div className="z-10 border rounded-lg w-full h-full text-sm lg:flex p-3">
        <ChatLayout />

      </div>


    </main>
  );
}
