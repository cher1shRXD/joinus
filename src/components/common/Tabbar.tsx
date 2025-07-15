"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Globe2, Home, MessageCircle, User2, UsersRound, LogIn } from "lucide-react";
import { useCustomRouter } from "@/hooks/common/useCustomRouter";
import { useUserStore } from "@/stores/user";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import app from "@/libs/firebase/firebaseConfig";
import { customFetch } from "@/libs/fetch/customFetch";
import { cookieManager } from "@/libs/cookie/cookie";
import { User } from "@/types/user";

type Tab = "groups" | "home" | "chats" | "profile" | "arounds";

const Tabbar = () => {
  const pathname = usePathname();
  const router = useCustomRouter();
  const { user, setUser } = useUserStore();

  const getCurrentTab = (): Tab => {
    if (pathname.includes("/arounds")) return "arounds";
    if (pathname.includes("/my-groups")) return "groups";
    if (pathname.includes("/my-chats")) return "chats";
    if (pathname.includes("/profile")) return "profile";
    return "home";
  };

  const [activeTab, setActiveTab] = useState<Tab>(getCurrentTab);

  useEffect(() => {
    const newTab = getCurrentTab();
    if (newTab !== activeTab) {
      setActiveTab(newTab);
    }
  }, [pathname]);

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(getAuth(app), provider);
      const idToken = await result.user.getIdTokenResult();
      if (idToken) {
        const data = await customFetch.post<{ user: User, accessToken: string, isNewUser: boolean }>('/auth/verify', { idToken: idToken.token });
        if (data) {
          await cookieManager.set("accessToken", data.accessToken);
          setUser(data.user);
          setActiveTab("home");
          router.push("/");
        }
      }
    } catch (e) {
      console.error("Login failed:", e);
    }
  };

  const handleTabClick = (tab: Tab) => {
    if (tab === activeTab) return;
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
        if (user) {
          router.push("/profile");
        } else {
          handleGoogleLogin();
        }
        break;
      case "arounds":
        router.push("/arounds");
        break;
    }
  };

  return (
    <div className="w-full h-16 border-t border-gray-100 flex items-center bg-white text-xs fixed bottom-0 z-50 px-4">
      <button onClick={() => handleTabClick("arounds")} className={tabClass(activeTab, "arounds")}>
        <Globe2 size={20} />
        <p>둘러보기</p>
      </button>
      <button onClick={() => handleTabClick("groups")} className={tabClass(activeTab, "groups")}>
        <UsersRound size={20} />
        <p>내 모임</p>
      </button>
      <button onClick={() => handleTabClick("home")} className={tabClass(activeTab, "home")}>
        <Home size={20} />
        <p>홈</p>
      </button>
      <button onClick={() => handleTabClick("chats")} className={tabClass(activeTab, "chats")}>
        <MessageCircle size={20} />
        <p>채팅</p>
      </button>
      <button onClick={() => handleTabClick("profile")} className={tabClass(activeTab, "profile")}>
        {user ? <User2 size={20} /> : <LogIn size={20} />}
        <p>{user ? "프로필" : "로그인"}</p>
      </button>
    </div>
  );
};

const tabClass = (activeTab: string, current: string) =>
  `${activeTab === current ? "text-primary" : "text-gray-500"} flex-1 flex flex-col items-center gap-0.5 py-2`;

export default Tabbar;
