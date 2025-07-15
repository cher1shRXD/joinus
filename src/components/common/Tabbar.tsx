"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Globe2, Home, MessageCircle, User2, UsersRound } from "lucide-react";
import { useCustomRouter } from "@/hooks/common/useCustomRouter";

type Tab = "groups" | "home" | "chats" | "profile" | "arounds";

const Tabbar = () => {
  const pathname = usePathname();
  const router = useCustomRouter();

  const getCurrentTab = (): Tab => {
    if (pathname.includes("/arounds")) return "arounds";
    if (pathname.includes("/my-groups")) return "groups";
    if (pathname.includes("/my-chats")) return "chats";
    if (pathname.includes("/profile")) return "profile";
    return "home";
  };

  const [activeTab, setActiveTab] = useState<Tab>(getCurrentTab);

  // pathname이 바뀌었을 때 activeTab 동기화
  useEffect(() => {
    const newTab = getCurrentTab();
    if (newTab !== activeTab) {
      setActiveTab(newTab);
    }
  }, [pathname]);

  // 탭 클릭 시 라우터 이동 + 상태 설정
  const handleTabClick = (tab: Tab) => {
    if (tab === activeTab) return; // 중복 클릭 방지
    setActiveTab(tab);

    switch (tab) {
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
      case "arounds":
        router.push("/arounds");
        break;
    }
  };

  return (
    <div className="w-full h-16 border-t border-gray-200 flex justify-evenly items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] bg-white text-xs fixed bottom-0 z-50">
      <button onClick={() => handleTabClick("arounds")} className={tabClass(activeTab, "arounds")}>
        <Globe2 />
        <p>둘러보기</p>
      </button>
      <button onClick={() => handleTabClick("groups")} className={tabClass(activeTab, "groups")}>
        <UsersRound />
        <p>내 모임</p>
      </button>
      <button onClick={() => handleTabClick("home")} className={tabClass(activeTab, "home")}>
        <Home />
        <p>홈</p>
      </button>
      <button onClick={() => handleTabClick("chats")} className={tabClass(activeTab, "chats")}>
        <MessageCircle />
        <p>채팅</p>
      </button>
      <button onClick={() => handleTabClick("profile")} className={tabClass(activeTab, "profile")}>
        <User2 />
        <p>프로필</p>
      </button>
    </div>
  );
};

const tabClass = (activeTab: string, current: string) =>
  `${activeTab === current ? "text-primary" : "text-gray-500"} flex flex-col items-center gap-0.5`;

export default Tabbar;
