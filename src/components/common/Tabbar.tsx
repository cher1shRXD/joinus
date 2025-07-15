"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Home, MessageCircle, User2, UsersRound } from "lucide-react";

type Tab = "groups" | "home" | "chats" | "profile";

const Tabbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const getCurrentTab = (): Tab => {
    if (pathname.includes("/my-groups")) return "groups";
    if (pathname.includes("/my-chats")) return "chats";
    if (pathname.includes("/profile")) return "profile";
    return "home";
  };

  const [activeTab, setActiveTab] = useState<Tab>(getCurrentTab);

  useEffect(() => {
    switch (activeTab) {
      case "groups":
        router.push("/my-groups");
        break;
      case "home":
        router.push("/");
        break;
      case "chats":
        router.push("/my-chats");
        break;
      case "profile":
        router.push("/profile");
        break;
    }
  }, [activeTab]);

  return (
    <div className="w-full h-16 border-t border-gray-200 flex justify-evenly items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] bg-white text-xs fixed bottom-0 z-50">
      <button
        onClick={() => setActiveTab("groups")}
        className={`${activeTab === "groups" ? "text-primary" : "text-gray-500"} flex flex-col items-center gap-0.5`}
      >
        <UsersRound />
        <p>내 모임</p>
      </button>
      <button
        onClick={() => setActiveTab("home")}
        className={`${activeTab === "home" ? "text-primary" : "text-gray-500"} flex flex-col items-center gap-0.5`}
      >
        <Home />
        <p>홈</p>
      </button>
      <button
        onClick={() => setActiveTab("chats")}
        className={`${activeTab === "chats" ? "text-primary" : "text-gray-500"} flex flex-col items-center gap-0.5`}
      >
        <MessageCircle />
        <p>채팅</p>
      </button>
      <button
        onClick={() => setActiveTab("profile")}
        className={`${activeTab === "profile" ? "text-primary" : "text-gray-500"} flex flex-col items-center gap-0.5`}
      >
        <User2 />
        <p>프로필</p>
      </button>
    </div>
  );
};

export default Tabbar;
