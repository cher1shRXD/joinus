"use client";

import GoBack from "@/components/common/GoBack";
import { customFetch } from "@/libs/fetch/customFetch";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

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
      <div className="w-full h-full flex flex-col items-center justify-center">
        <p>그룹 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (!groupDetails) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-red-500">
        <p>그룹을 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full p-2">
        <GoBack title="그룹 상세" />
      </div>
      <div className="flex-1 p-3 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">{groupDetails.name}</h1>
        <p className="text-gray-700">{groupDetails.description}</p>
        <p className="text-sm text-gray-500 mt-4">
          그룹 ID: {groupDetails.meetingId}
        </p>
        {type === "flash" ? (
          <>
            <p className="text-gray-700">
              시작 시간: {new Date(groupDetails.startTime).toLocaleString()}
            </p>
            <p className="text-gray-700">
              예상 지속 시간: {groupDetails.expectedDurationMinutes}분
            </p>
            <p className="text-gray-700">
              위치: {groupDetails.location.addressString} (위도:{" "}
              {groupDetails.location.latitude}, 경도:{" "}
              {groupDetails.location.longitude})
            </p>
            <p className="text-gray-700">
              멤버 제한: {groupDetails.memberLimit}
            </p>
            <p className="text-gray-700">
              개설자 UID: {groupDetails.organizerUid}
            </p>
            <p className="text-gray-700">
              멤버 수: {groupDetails.members.length}
            </p>
            <p className="text-gray-700">
              생성일: {new Date(groupDetails.createdAt).toLocaleString()}
            </p>
            <p className="text-gray-700">
              업데이트일: {new Date(groupDetails.updatedAt).toLocaleString()}
            </p>
          </>
        ) : (
          <>
            <p className="text-gray-700">카테고리: {groupDetails.category}</p>
            <p className="text-gray-700">
              개설자 UID: {groupDetails.organizerUid}
            </p>
            <p className="text-gray-700">
              위치: {groupDetails.location.addressString} (위도:{" "}
              {groupDetails.location.latitude}, 경도:{" "}
              {groupDetails.location.longitude})
            </p>
            <p className="text-gray-700">
              승인 필요: {groupDetails.requiresApproval ? "예" : "아니오"}
            </p>
            <p className="text-gray-700">상태: {groupDetails.status}</p>
            <p className="text-gray-700">
              멤버 수: {groupDetails.members.length}
            </p>
            <p className="text-gray-700">
              생성일: {new Date(groupDetails.createdAt).toLocaleString()}
            </p>
            <p className="text-gray-700">
              업데이트일: {new Date(groupDetails.updatedAt).toLocaleString()}
            </p>
            {groupDetails.photos && groupDetails.photos.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mt-4">사진</h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  {groupDetails.photos.map((photo: string, index: number) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`Group Photo ${index + 1}`}
                      className="w-32 h-32 object-cover rounded-md"
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GroupDetailPage;
