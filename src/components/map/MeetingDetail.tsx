"use client";

import { useMeetingStore } from "@/stores/meeting";
import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { FlashMeeting, RegularMeeting } from "@/types/meeting";
import { toast } from "../provider/ToastProvider";
import { customFetch } from "@/libs/fetch/customFetch";

const MeetingDetail = () => {
  const { meeting, setMeeting } = useMeetingStore();
  const startY = useRef<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const [currentHeight, setCurrentHeight] = useState("h-[35vh]");

  const handleStart = (y: number) => {
    startY.current = y;
    setDragging(true);
  };

  const handleMove = (y: number) => {
    if (!dragging || startY.current === null) return;
    const deltaY = y - startY.current; // positive for down, negative for up

    if (deltaY > 0) { // Dragging down
      if (currentHeight === "h-[70vh]") {
        if (deltaY > 50) { // Threshold to go from 70vh to 35vh
          setCurrentHeight("h-[35vh]");
          startY.current = y; // Reset startY to make the next drag relative to the new 35vh position
        }
      } else if (currentHeight === "h-[35vh]") {
        if (deltaY > 100) { // Threshold to dismiss from 35vh
          setMeeting(null);
          setDragging(false);
          setCurrentHeight("h-[35vh]"); // Reset height for next time
        }
      }
    } else { // Dragging up (deltaY < 0)
      if (currentHeight === "h-[35vh]") {
        if (deltaY < -50) { // Threshold to go from 35vh to 70vh
          setCurrentHeight("h-[70vh]");
          startY.current = y; // Reset startY to make the next drag relative to the new 70vh position
        }
      }
    }
  };

  const handleEnd = () => {
    startY.current = null;
    setDragging(false);
  };

  const isRegularMeeting = (meeting: any): meeting is RegularMeeting => {
    return meeting && "photos" in meeting;
  };

  const isFlashMeeting = (meeting: any): meeting is FlashMeeting => {
    return meeting && "startTime" in meeting;
  };

  const handleRequest = async () => {
    if(!meeting) return;
    try{
      const data = await customFetch.post(`/meetings/${meeting.type}/${meeting?.meetingId}/join`, {});
      if(data) {
        toast.success("requiresApproval" in meeting && meeting?.requiresApproval ? "참여 신청 완료" : "참여 완료");
        setMeeting(null);
      }
    }catch{
      toast.error("참여 신청 실패");
    }
  }

  return (
    <div
      className={`w-full ${meeting ? currentHeight : "h-24"}
       bg-white rounded-t-2xl absolute bottom-0 left-0 z-40 shadow-[0_-8px_12px_-1px_rgba(0,0,0,0.1)] transition-all pb-16`}>
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
        <div className="w-full h-[calc(100%-20px)] px-4 overflow-y-auto space-y-2">
          <p className="font-bold text-lg">{meeting?.name}</p>
          <p className="text-gray-600">{meeting?.description}</p>
          <p className="text-sm text-gray-400">참여자: {meeting?.members.length}</p>
          <p className="text-xs text-gray-400">
            주소: {meeting?.location.addressString}
          </p>
          {isRegularMeeting(meeting) && (
            <>
              {meeting.photos && meeting.photos.length > 0 && (
                <Swiper
                  modules={[Pagination, Navigation]}
                  pagination={{ clickable: true }}
                  navigation
                  className="mySwiper w-full h-48 rounded-lg mb-4"
                >
                  {meeting.photos.map((photo, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={process.env.NEXT_PUBLIC_API_URL + photo}
                        alt={`Meeting photo ${index + 1}`}
                        className="rounded-lg"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
              <button className="text-white rounded-lg py-2 bg-primary w-full disabled:bg-gray-300 mb-4" onClick={handleRequest} disabled={meeting.isMember}>
                {meeting.isMember ? "이미 참여한 모임입니다." : meeting.requiresApproval ? "참여 신청하기" : "참여하기"}
              </button>
            </>
          )}
          {isFlashMeeting(meeting) && (
            <>
              <p className="text-sm text-gray-400">
                시작 시간: {new Date(meeting.startTime._seconds * 1000).toLocaleString()}
              </p>
              <p className="text-sm text-gray-400">
                예상 소요 시간: {meeting.expectedDurationMinutes}분
              </p>
              <p className="text-sm text-gray-400">
                인원 제한: {meeting.memberLimit}명
              </p>
              <button className="text-white rounded-lg py-2 bg-primary w-full mb-4 disabled:bg-gray-300" onClick={handleRequest} disabled={meeting.isMember}>
                {meeting.isMember ? "이미 참여한 모임입니다." : "참여하기"}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MeetingDetail;
