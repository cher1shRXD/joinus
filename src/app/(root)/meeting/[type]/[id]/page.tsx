"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { customFetch } from "@/libs/fetch/customFetch";
import { RegularMeeting, FlashMeeting } from "@/types/meeting";
import { useUserStore } from "@/stores/user";
import { useCustomRouter } from "@/hooks/common/useCustomRouter";
import { ArrowLeft, MapPin, Users, Clock, Calendar, UserPlus, UserMinus } from "lucide-react";

const MeetingDetail = () => {
  const params = useParams();
  const router = useCustomRouter();
  const { user } = useUserStore();
  const [meeting, setMeeting] = useState<RegularMeeting | FlashMeeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [joinLoading, setJoinLoading] = useState(false);

  const meetingType = params.type as 'regular' | 'flash';
  const meetingId = params.id as string;

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const url = `/meetings/${meetingType}/${meetingId}`;
        const data = await customFetch.get<RegularMeeting | FlashMeeting>(url);
        setMeeting(data);
      } catch (error) {
        console.error('Failed to fetch meeting:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeeting();
  }, [meetingType, meetingId]);

  const handleJoinLeave = async () => {
    if (!user || !meeting) return;
    
    try {
      setJoinLoading(true);
      const isMember = meeting.members.includes(user.uid);
      const action = isMember ? 'leave' : 'join';
      
      await customFetch.post(`/meetings/${meetingType}/${meetingId}/${action}`, {});
      
      setMeeting(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          members: isMember 
            ? prev.members.filter(id => id !== user.uid)
            : [...prev.members, user.uid]
        };
      });
    } catch (error) {
      console.error(`Failed to ${meeting.members.includes(user.uid) ? 'leave' : 'join'} meeting:`, error);
    } finally {
      setJoinLoading(false);
    }
  };

  const formatFlashTime = (timestamp: { _seconds: number; _nanoseconds: number } | string) => {
    const date = typeof timestamp === 'string' 
      ? new Date(timestamp)
      : new Date(timestamp._seconds * 1000);
    return date.toLocaleString('ko-KR', {
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getImageUrl = () => {
    if (meetingType === 'regular') {
      const regularMeeting = meeting as RegularMeeting;
      if (regularMeeting.photos && regularMeeting.photos.length > 0) {
        const photo = regularMeeting.photos[0];
        return photo.startsWith('/uploads') 
          ? `${process.env.NEXT_PUBLIC_API_URL}${photo}` 
          : photo;
      }
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-gray-400 text-4xl mb-2">😞</div>
        <div className="text-gray-500">모임을 찾을 수 없습니다</div>
      </div>
    );
  }

  const imageUrl = getImageUrl();
  const isMember = user ? meeting.members.includes(user.uid) : false;
  const isOrganizer = user ? meeting.organizerUid === user.uid : false;

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      <div className="relative">
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 z-10 p-2 bg-black/20 rounded-full text-white"
        >
          <ArrowLeft size={20} />
        </button>
        
        <div className="h-64 bg-gray-200 flex items-center justify-center overflow-hidden">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={meeting.name}
              className="w-full h-full object-cover" 
            />
          ) : (
            <div className="w-full h-full bg-primary/20 flex items-center justify-center">
              <span className="text-primary text-6xl font-medium">
                {meeting.name.charAt(0)}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 space-y-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-xl font-bold text-gray-900">{meeting.name}</h1>
              <span className={`text-xs px-2 py-1 rounded-full ${
                meetingType === 'regular' 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'bg-orange-100 text-orange-600'
              }`}>
                {meetingType === 'regular' ? '정기' : '번개'}
              </span>
            </div>
            <p className="text-gray-600 leading-relaxed">{meeting.description}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <MapPin size={20} className="text-gray-400 mt-0.5" />
            <div>
              <div className="font-medium text-gray-900">모임 장소</div>
              <div className="text-sm text-gray-600">{meeting.location.addressString}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Users size={20} className="text-gray-400 mt-0.5" />
            <div>
              <div className="font-medium text-gray-900">참여 인원</div>
              <div className="text-sm text-gray-600">
                {meeting.members.length}명 참여
                {meetingType === 'flash' && ` / 최대 ${(meeting as FlashMeeting).memberLimit}명`}
              </div>
            </div>
          </div>

          {meetingType === 'flash' && (
            <>
              <div className="flex items-start gap-3">
                <Clock size={20} className="text-gray-400 mt-0.5" />
                <div>
                  <div className="font-medium text-gray-900">모임 시간</div>
                  <div className="text-sm text-gray-600">
                    {formatFlashTime((meeting as FlashMeeting).startTime)}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar size={20} className="text-gray-400 mt-0.5" />
                <div>
                  <div className="font-medium text-gray-900">예상 소요 시간</div>
                  <div className="text-sm text-gray-600">
                    {(meeting as FlashMeeting).expectedDurationMinutes}분
                  </div>
                </div>
              </div>
            </>
          )}

          {meetingType === 'regular' && (
            <div className="flex items-start gap-3">
              <Calendar size={20} className="text-gray-400 mt-0.5" />
              <div>
                <div className="font-medium text-gray-900">참여 방식</div>
                <div className="text-sm text-gray-600">
                  {(meeting as RegularMeeting).requiresApproval ? '승인 필요' : '자유 참여'}
                </div>
              </div>
            </div>
          )}
        </div>

        {user && !isOrganizer && (
          <button
            onClick={handleJoinLeave}
            disabled={joinLoading}
            className={`w-full py-4 rounded-2xl font-semibold transition-colors flex items-center justify-center gap-2 ${
              isMember
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-primary text-white hover:bg-primary/90'
            } ${joinLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {joinLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {isMember ? <UserMinus size={20} /> : <UserPlus size={20} />}
                {isMember ? '모임 나가기' : '모임 참여하기'}
              </>
            )}
          </button>
        )}

        {isOrganizer && (
          <div className="bg-blue-50 p-4 rounded-2xl">
            <div className="flex items-center gap-2 text-blue-600">
              <Users size={16} />
              <span className="text-sm font-medium">내가 주최한 모임입니다</span>
            </div>
          </div>
        )}

        {!user && (
          <div className="bg-gray-100 p-4 rounded-2xl text-center">
            <div className="text-gray-600 text-sm">
              모임에 참여하려면 로그인이 필요합니다
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetingDetail;