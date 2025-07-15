"use client";

import GroupTypeSelector from "@/components/common/GroupTypeSelector";
import SearchInput from "@/components/common/SearchInput";
import MeetingDetail from "@/components/map/MeetingDetail";
import { useCustomRouter } from "@/hooks/common/useCustomRouter";
import { Plus } from "lucide-react";
import dynamic from "next/dynamic";
import React from "react";

const Map = dynamic(
  () => import("@/components/map/Map").then((m) => m.default),
  { ssr: false }
);

const Main = () => {
  const router = useCustomRouter();

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen relative">
      <div className="w-full h-full relative z-10">
        <Map />
      </div>
      
      <button
        className="fixed bottom-24 right-4 z-30 w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30 transition-all duration-200 hover:scale-105"
        onClick={() => router.push("/my-groups/create")}
      >
        <Plus size={24} className="text-white" />
      </button>
      
      <SearchInput />
      <GroupTypeSelector />
      <MeetingDetail />
    </div>
  );
};

export default Main;
