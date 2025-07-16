"use client";

import { customFetch } from "@/libs/fetch/customFetch";
import { useUserStore } from "@/stores/user";
import { Meeting } from "@/types/meeting";
import { useEffect, useState } from "react";
import GoBack from "@/components/common/GoBack";
import { useCustomRouter } from "@/hooks/common/useCustomRouter";
import { toast } from "@/components/provider/ToastProvider";
import { Users, MapPin, Settings } from "lucide-react";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import { nanoid } from "nanoid";

const MyGroupsPage = () => {
  const { user } = useUserStore();
  const [joinedMeetings, setJoinedMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<"all" | "regular" | "flash">(
    "all"
  );
  const router = useCustomRouter();

  const handleUpgrade = async (meetingId: string) => {
    try {
      const tossPayments = await loadTossPayments('test_ck_yZqmkKeP8g9mXwvnmvkxVbQRxB9l');
      const payment = tossPayments.payment({
        customerKey: nanoid(),
      });

      await payment.requestPayment({
        method: 'CARD',
        amount: {
          currency: 'KRW',
          value: 5000,
        },
        orderId: `promotion_${meetingId}_${nanoid()}`,
        orderName: '모임 프로모션 업그레이드',
        successUrl: `${window.location.origin}/payment/success?meetingId=${meetingId}`,
        failUrl: `${window.location.origin}/payment/fail`,
        customerEmail: user?.email || 'customer@example.com',
        customerName: user?.nickname || '고객',
      });
    } catch (error) {
      console.error('결제 요청 오류:', error);
      toast.error('결제 요청 중 오류가 발생했습니다.');
    }
  };

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

  const filteredMeetings = joinedMeetings.filter((meeting) => {
    if (selectedTab === "all") return true;
    return meeting.type === selectedTab;
  });

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
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen">
      <div className="bg-white p-4">
        <h1 className="text-xl font-bold text-gray-900 mb-3">내 모임</h1>

        <div className="flex gap-1">
          <button
            onClick={() => setSelectedTab("all")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              selectedTab === "all"
                ? "bg-primary text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            전체
          </button>
          <button
            onClick={() => setSelectedTab("flash")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              selectedTab === "flash"
                ? "bg-primary text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            번개
          </button>
          <button
            onClick={() => setSelectedTab("regular")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              selectedTab === "regular"
                ? "bg-primary text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            정기
          </button>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="text-gray-500">로딩 중...</div>
          </div>
        ) : filteredMeetings.length === 0 ? (
          <div className="flex flex-col items-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Users size={24} className="text-gray-400" />
            </div>
            <div className="text-gray-500 text-center">
              <p className="font-medium mb-1">
                {selectedTab === "all"
                  ? "참여한 모임이 없습니다"
                  : selectedTab === "flash"
                  ? "참여한 번개 모임이 없습니다"
                  : "참여한 정기 모임이 없습니다"}
              </p>
              <p className="text-sm text-gray-400">
                새로운 모임에 참여해보세요
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMeetings.map((meeting) => (
              <div
                key={meeting.meetingId}
                onClick={() =>
                  handleGroupClick(meeting.meetingId, meeting.type)
                }
                className="bg-white rounded-xl p-4 hover:shadow-sm active:scale-[0.98] transition-all duration-200 cursor-pointer border border-gray-100"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 text-base truncate">
                        {meeting.name}
                      </h3>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-md font-medium flex-shrink-0 ${
                          meeting.type === "regular"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {meeting.type === "regular" ? "정기" : "번개"}
                      </span>
                    </div>
                    {user?.uid === meeting.organizerUid && (
                      <div className="flex items-center gap-1 mb-2">
                        <Settings size={12} className="text-blue-600" />
                        <span className="text-xs text-blue-600 font-medium">
                          관리자
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-sm text-gray-600 mb-3 overflow-hidden">
                  <div
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {meeting.description}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-600 truncate">
                      {meeting.location.addressString}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-600">
                      {meeting.members.length}명 참여 중
                    </span>
                  </div>
                </div>

                {user?.uid === meeting.organizerUid && (
                  <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <button
                      className="flex-1 text-sm bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100 active:bg-blue-200 transition-colors font-medium"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(
                          `/my-groups/${meeting.type}+${meeting.meetingId}/requests`
                        );
                      }}
                    >
                      참가 요청
                    </button>
                    <button
                      className="flex-1 text-sm bg-green-50 text-green-600 py-2 rounded-lg hover:bg-green-100 active:bg-green-200 transition-colors font-medium"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpgrade(meeting.meetingId);
                      }}
                    >
                      프로모션
                    </button>
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
