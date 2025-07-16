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
  const [currentHeight, setCurrentHeight] = useState("h-[45vh]");

  const handleStart = (y: number) => {
    startY.current = y;
    setDragging(true);
  };

  const handleMove = (y: number) => {
    if (!dragging || startY.current === null) return;
    const deltaY = y - startY.current;

    if (deltaY > 0) { // Dragging down
      if (currentHeight === "h-[80vh]") {
        if (deltaY > 50) {
          setCurrentHeight("h-[45vh]");
          startY.current = y;
        }
      } else if (currentHeight === "h-[45vh]") {
        if (deltaY > 100) {
          setMeeting(null);
          setDragging(false);
          setCurrentHeight("h-[45vh]");
        }
      }
    } else { // Dragging up
      if (currentHeight === "h-[45vh]") {
        if (deltaY < -50) {
          setCurrentHeight("h-[80vh]");
          startY.current = y;
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

  if (!meeting) {
    return null;
  }

  return (
    <div
      className={`w-full ${currentHeight} bg-white rounded-t-2xl absolute bottom-0 left-0 z-40 transition-all duration-300 pb-16`}
      style={{
        boxShadow: '0 -8px 25px -5px rgba(0, 0, 0, 0.1), 0 -8px 10px -6px rgba(0, 0, 0, 0.1)'
      }}>
      <div
        className="w-full h-6 flex items-center justify-center touch-none cursor-grab"
        onMouseDown={(e) => handleStart(e.clientY)}
        onMouseMove={(e) => handleMove(e.clientY)}
        onMouseUp={handleEnd}
        onTouchStart={(e) => handleStart(e.touches[0].clientY)}
        onTouchMove={(e) => handleMove(e.touches[0].clientY)}
        onTouchEnd={handleEnd}>
        <div className="w-12 h-1.5 rounded-full bg-gray-300" />
      </div>
      <div className="w-full h-[calc(100%-24px)] px-4 overflow-y-auto space-y-3">
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
    </div>
  );
};

export default MeetingDetail;
