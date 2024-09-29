"use client";
import { useAppContext } from "@/app/Context/AppContext";
import React from "react";

export default function UsersCount() {
  const { liveUsers, totalUsers } = useAppContext();
  return (
   <div className="text-xs">
  <span style={{ color: "#28a745" }}>  {/* Green for active users */}
    {liveUsers} {liveUsers === 1 ? "User" : "Users"} Active Out of{" "}
  </span>
  <span style={{ color: "#007bff" }}>  {/* Blue for total users */}
    {totalUsers} {totalUsers === 1 ? "User" : "Users"}
  </span>
</div>
  );
}
