"use client";

import { useAppContext } from "@/app/Context/AppContext";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function Navbar() {
  const usePath = usePathname();
  const { loggedIn, socket, isCounted, setIsCounted } = useAppContext();
  useEffect(() => {
    if (!socket) {
      // console.log(`Web Socket Server Not Connected`);
      return;
    }
    if (usePath !== "/" && isCounted) {
      // console.log(`Emitting User Disconnect Event`);
      socket.emit("userDisconnect", {});
      setIsCounted(false);
    }
  }, [isCounted, loggedIn, setIsCounted, socket, usePath]);
  return <></>;
}
