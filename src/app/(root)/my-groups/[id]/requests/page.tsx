"use client";

import GoBack from "@/components/common/GoBack";
import { customFetch } from "@/libs/fetch/customFetch";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "@/components/provider/ToastProvider";
import { User, Clock, CheckCircle, XCircle } from "lucide-react";

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
      <div className="max-w-md mx-auto bg-gray-50 min-h-screen">
        <div className="bg-white p-4">
          <GoBack title="참가 요청 관리" />
        </div>
        <div className="flex justify-center py-12">
          <div className="text-gray-500">참가 요청을 불러오는 중...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto bg-gray-50 min-h-screen">
        <div className="bg-white p-4">
          <GoBack title="참가 요청 관리" />
        </div>
        <div className="flex flex-col items-center py-12">
          <div className="text-gray-400 text-4xl mb-2">❌</div>
          <div className="text-gray-500 text-center">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen">
      <div className="bg-white p-4">
        <GoBack title="참가 요청 관리" />
        <h1 className="text-xl font-bold text-gray-900 mt-4">참가 요청</h1>
      </div>

      <div className="p-4">
        {requests.length === 0 ? (
          <div className="flex flex-col items-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <User size={24} className="text-gray-400" />
            </div>
            <div className="text-gray-500 text-center">
              <p className="font-medium mb-1">현재 참가 요청이 없습니다</p>
              <p className="text-sm text-gray-400">새로운 요청이 오면 여기에 표시됩니다</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((request) => (
              <div key={request.requestId} className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  {request.user.profileImageUrl ? (
                    <img 
                      src={request.user.profileImageUrl} 
                      alt={request.user.nickname} 
                      className="w-12 h-12 rounded-full object-cover" 
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-600 font-semibold">
                        {request.user.nickname.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{request.user.nickname}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock size={12} className="text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {new Date(request.requestedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {request.status === 'pending' && (
                      <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-lg font-medium">
                        대기중
                      </span>
                    )}
                    {request.status === 'approved' && (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-lg font-medium flex items-center gap-1">
                        <CheckCircle size={12} />
                        승인됨
                      </span>
                    )}
                    {request.status === 'rejected' && (
                      <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-lg font-medium flex items-center gap-1">
                        <XCircle size={12} />
                        거절됨
                      </span>
                    )}
                  </div>
                </div>
                
                {request.status === 'pending' && (
                  <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleApproveReject(request.requestId, 'approve')}
                      className="flex-1 bg-green-50 text-green-600 py-2 rounded-lg hover:bg-green-100 active:bg-green-200 transition-colors font-medium text-sm"
                    >
                      승인
                    </button>
                    <button
                      onClick={() => handleApproveReject(request.requestId, 'reject')}
                      className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100 active:bg-red-200 transition-colors font-medium text-sm"
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
