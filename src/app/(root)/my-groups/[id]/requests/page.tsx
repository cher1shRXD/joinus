"use client";

import GoBack from "@/components/common/GoBack";
import { customFetch } from "@/libs/fetch/customFetch";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "@/components/provider/ToastProvider";

interface JoinRequest {
  requestId: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  user: {
    uid: string;
    nickname: string;
    profileImageUrl: string;
  };
}

const JoinRequestsPage = () => {
  const params = useParams();
  const { id } = params;
  const meetingId = (id as string).split("%2B")[1];
  const type = (id as string).split("%2B")[0];

  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJoinRequests = async () => {
      try {
        setLoading(true);
        const data = await customFetch.get<JoinRequest[]>(`/meetings/${meetingId}/requests`);
        setRequests(data);
      } catch (err) {
        console.error("Failed to fetch join requests:", err);
        setError("참가 요청을 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJoinRequests();
    }
  }, [id, type, meetingId]);

  const handleApproveReject = async (requestId: string, action: 'approve' | 'reject') => {
    try {
      await customFetch.post(`/meetings/requests/${requestId}/${action}`, {});
      setRequests(prevRequests =>
        prevRequests.map(req =>
          req.requestId === requestId ? { ...req, status: action === 'approve' ? 'approved' : 'rejected' } : req
        )
      );
      toast.success(`요청이 ${action === 'approve' ? '승인' : '거절'}되었습니다.`);
    } catch (err) {
      console.error(`Failed to ${action} request:`, err);
      toast.error(`요청 ${action === 'approve' ? '승인' : '거절'} 실패.`);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <p>참가 요청을 불러오는 중...</p>
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
    <div className="w-full h-full flex flex-col">
      <div className="w-full p-2">
        <GoBack title="참가 요청 관리" />
      </div>
      <div className="flex-1 p-3 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">참가 요청</h1>
        {requests.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">현재 참가 요청이 없습니다.</p>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request.requestId} className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center gap-3">
                  {request.user.profileImageUrl ? (
                    <img src={request.user.profileImageUrl} alt={request.user.nickname} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                      {request.user.nickname.charAt(0)}
                    </div>
                  )}
                  <p className="font-bold text-lg">{request.user.nickname}</p>
                </div>
                <p className="text-gray-600">요청일: {new Date(request.requestedAt).toLocaleString()}</p>
                <p className="text-sm text-gray-500">상태: {request.status === 'pending' ? '대기 중' : request.status === 'approved' ? '승인됨' : '거절됨'}</p>
                {request.status === 'pending' && (
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => handleApproveReject(request.requestId, 'approve')}
                      className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                    >
                      승인
                    </button>
                    <button
                      onClick={() => handleApproveReject(request.requestId, 'reject')}
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                    >
                      거절
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

export default JoinRequestsPage;
