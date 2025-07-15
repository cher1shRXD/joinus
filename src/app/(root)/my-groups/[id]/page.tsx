"use client";

import GoBack from "@/components/common/GoBack";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const GroupDetailPage = () => {
  const params = useParams();
  const { id } = params;

  const [groupDetails, setGroupDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setGroupDetails({ id: id, name: `Group ${id}`, description: `Details for group ${id}` });
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
        <p className="text-sm text-gray-500 mt-4">그룹 ID: {groupDetails.id}</p>
        {/* Add more group details here */}
      </div>
    </div>
  );
};

export default GroupDetailPage;
