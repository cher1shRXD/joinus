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
    <>
      <div className="w-full h-full relative z-10">
        <Map />
      </div>
      <button
        className="fixed bottom-28 right-3 z-30 flex bg-primary text-white p-2 pr-3 rounded-lg items-center"
        onClick={() => router.push("/my-groups/create")}
      >
        <Plus size={20} />
        <p className="text-sm font-semibold">모임 생성</p>
      </button>
      <SearchInput />
      <GroupTypeSelector />
      <MeetingDetail />
    </>
  );
};

export default Main;
