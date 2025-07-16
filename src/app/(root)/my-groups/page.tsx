"use client";

import { customFetch } from "@/libs/fetch/customFetch";
import { useUserStore } from "@/stores/user";
import { Meeting } from "@/types/meeting";
import { useEffect, useState } from "react";
import GoBack from "@/components/common/GoBack";
import { useCustomRouter } from "@/hooks/common/useCustomRouter";
import SearchInput from "@/components/common/SearchInput";
import { toast } from "@/components/provider/ToastProvider";

const MyGroupsPage = () => {
  const { user } = useUserStore();
  const [joinedMeetings, setJoinedMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useCustomRouter();

  const handleUpgrade = async (meetingId: string) => {
    try {
      const data = await customFetch.post(`/meetings/regular/${meetingId}/upgrade`, {});
      if(data){
        toast.success("프로모션 업그레이드 성공!");
      }
    }catch{
      toast.error("네트워크 에러");
    }
  }

  useEffect(() => {
    const fetchJoinedMeetings = async () => {
      try {
        setLoading(true);
        const data = await customFetch.get<Meeting[]>("/meetings/my");
        setJoinedMeetings(data);
      } catch (err) {
        console.error("Failed to fetch joined meetings:", err);
        setError("모임을 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchJoinedMeetings();
  }, []);

  const handleGroupClick = (meetingId: string, type: string) => {
    router.push(`/my-groups/${type}+${meetingId}`);
  };

  const filteredMeetings = joinedMeetings.filter((meeting) =>
    meeting.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <p>모임을 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-4 flex flex-col">
      <h1 className="text-xl font-semibold">내 모임</h1>
      <div className="flex-1 overflow-y-auto">
        {filteredMeetings.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            참여한 모임이 없습니다.
          </p>
        ) : (
          <div className="space-y-4">
            {filteredMeetings.map((meeting) => (
              <div
                key={meeting.meetingId}
                className="bg-white p-4 rounded-lg shadow cursor-pointer"
                onClick={() =>
                  handleGroupClick(meeting.meetingId, meeting.type)
                }>
                <p className="font-bold text-lg">{meeting.name}</p>
                <p className="text-gray-600">{meeting.description}</p>
                <p className="text-sm text-gray-400">
                  주소: {meeting.location.addressString}
                </p>
                {user?.uid === meeting.organizerUid && (
                  <div className="mt-2 p-2 bg-blue-100 rounded-md">
                    <p className="text-blue-700 font-semibold">
                      당신은 이 모임의 관리자입니다.
                    </p>
                    <div className="w-full flex items-center gap-2">
                      <button
                        className="mt-1 text-blue-500 underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(
                            `/my-groups/${meeting.type}+${meeting.meetingId}/requests`
                          );
                        }}>
                        참가 요청 확인
                      </button>
                      <button
                        className="mt-1 text-blue-500 underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpgrade(meeting.meetingId);
                        }}>
                        프로모션 업그레이드
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyGroupsPage;
