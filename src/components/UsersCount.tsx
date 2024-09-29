"use client";
import { useAppContext } from "@/app/Context/AppContext";
import React from "react";

export default function UsersCount() {
  const { liveUsers, totalUsers } = useAppContext();
  return (
    <div className="text-xs">
      {liveUsers} {liveUsers === 1 ? "User" : "Users"} Active Out of{" "}
      {totalUsers} {totalUsers === 1 ? "User" : "Users"}
    </div>
  );
}
