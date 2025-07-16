"use client";

import GoBack from "@/components/common/GoBack";
import { customFetch } from "@/libs/fetch/customFetch";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MapPin, Users, Calendar, Clock, User } from "lucide-react";

const GroupDetailPage = () => {
  const params = useParams();
  const { id } = params;
  const [type, meetingId] = (id as string).split("%2B");

  const [groupDetails, setGroupDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      setLoading(true);
      const data =
        type === "regular"
          ? await customFetch.get(`/meetings/regular/${meetingId}`)
          : await customFetch.get(`/meetings/flash/${meetingId}`);
      setGroupDetails(data);
      setLoading(false);
    };

    if (id) {
      fetchGroupDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-md mx-auto bg-gray-50 min-h-screen">
        <div className="bg-white p-4">
          <GoBack title="모임 상세" />
        </div>
        <div className="flex justify-center py-12">
          <div className="text-gray-500">모임 정보를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  if (!groupDetails) {
    return (
      <div className="max-w-md mx-auto bg-gray-50 min-h-screen">
        <div className="bg-white p-4">
          <GoBack title="모임 상세" />
        </div>
        <div className="flex flex-col items-center py-12">
          <div className="text-gray-400 text-4xl mb-2">❌</div>
          <div className="text-gray-500 text-center">
            <p>모임을 찾을 수 없습니다</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen">
      <div className="bg-white p-4">
        <GoBack title="모임 상세" />
        
        <div className="mt-4">
          <h1 className="text-xl font-bold text-gray-900 mb-3">{groupDetails.name}</h1>
          <span className={`text-xs px-2 py-1 rounded-lg font-medium ${
            type === 'regular' 
              ? 'bg-blue-100 text-blue-600' 
              : 'bg-orange-100 text-orange-600'
          }`}>
            {type === 'regular' ? '정기 모임' : '번개 모임'}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <p className="text-gray-700">{groupDetails.description}</p>
        </div>

        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-gray-400" />
          <span className="text-gray-700 text-sm">
            {groupDetails.location.addressString}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Users size={16} className="text-gray-400" />
          <span className="text-gray-700 text-sm">
            {groupDetails.members.length}명 참여
            {type === 'flash' && ` / 최대 ${groupDetails.memberLimit}명`}
          </span>
        </div>

        {type === 'flash' && (
          <>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-gray-400" />
              <span className="text-gray-700 text-sm">
                {new Date(groupDetails.startTime).toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gray-400" />
              <span className="text-gray-700 text-sm">
                {groupDetails.expectedDurationMinutes}분 예상
              </span>
            </div>
          </>
        )}

        {type === 'regular' && (
          <>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gray-400" />
              <span className="text-gray-700 text-sm">
                {groupDetails.requiresApproval ? '승인 필요' : '자유 참여'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <User size={16} className="text-gray-400" />
              <span className="text-gray-700 text-sm">{groupDetails.category}</span>
            </div>
          </>
        )}

        {type === 'regular' && groupDetails.photos && groupDetails.photos.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">모임 사진</h3>
            <div className="grid grid-cols-2 gap-3">
              {groupDetails.photos.map((photo: string, index: number) => {
                const imageUrl = photo.startsWith('/uploads') 
                  ? `${process.env.NEXT_PUBLIC_API_URL}${photo}` 
                  : photo;
                return (
                  <img
                    key={index}
                    src={imageUrl}
                    alt={`모임 사진 ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg bg-gray-200"
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupDetailPage;