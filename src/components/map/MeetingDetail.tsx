"use client";

import { useMeetingStore } from "@/stores/meeting";
import { useRef, useState } from "react";

const MeetingDetail = () => {
  const { meeting, setMeeting } = useMeetingStore();
  const startY = useRef<number | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleStart = (y: number) => {
    startY.current = y;
    setDragging(true);
  };

  const handleMove = (y: number) => {
    if (!dragging || startY.current === null) return;
    const distance = y - startY.current;
    if (distance > 100) {
      setMeeting(null);
      setDragging(false);
    }
  };

  const handleEnd = () => {
    startY.current = null;
    setDragging(false);
  };

  return (
    <div
      className={`w-full ${
        meeting ? "h-[35vh]" : "h-24"
      } bg-white rounded-t-2xl absolute bottom-0 left-0 z-40 shadow-[0_-8px_12px_-1px_rgba(0,0,0,0.1)] transition-all pb-16`}>
      <div
        className="w-full h-5 flex items-center justify-center touch-none cursor-grab overflow-scroll"
        onMouseDown={(e) => handleStart(e.clientY)}
        onMouseMove={(e) => handleMove(e.clientY)}
        onMouseUp={handleEnd}
        onTouchStart={(e) => handleStart(e.touches[0].clientY)}
        onTouchMove={(e) => handleMove(e.touches[0].clientY)}
        onTouchEnd={handleEnd}>
        <div className="w-16 h-1 rounded-full bg-gray-300" />
      </div>
      {meeting && (
        <div className="w-full h-[calc(100%-20px)] px-4 overflow-y-auto">
          <p className="font-bold text-lg">{meeting?.name}</p>
          <p className="text-gray-600">{meeting?.description}</p>
          <p className="text-sm text-gray-400">참여자: {meeting?.members.length}</p>
          <p className="text-xs text-gray-400">
            주소: {meeting?.location.addressString}
          </p>
        </div>
      )}
    </div>
  );
};

export default MeetingDetail;
