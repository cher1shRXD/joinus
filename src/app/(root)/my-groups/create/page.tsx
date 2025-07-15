"use client";

import GoBack from "@/components/common/GoBack";
import { useState } from "react";

const CreateGroup = () => {
  const [selectedGroupType, setSeelctedGroupType] = useState(0);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full p-2">
        <GoBack title="모임 생성하기" />
      </div>
      <div className="w-full flex-1 p-3 pb-0">
        <div className="w-full flex bg-white rounded-xl shadow-lg items-center relative">
          <div
            className={`absolute top-1 ${
              selectedGroupType === 0 ? "left-1" : "left-[calc(50%-4px)]"
            } bg-primary h-[calc(100%-8px)] w-1/2 rounded-lg transition-all duration-300`}
          />
          <div
            className={`flex-1 text-center py-3 text-sm z-20 font-medium transition-colors ${
              selectedGroupType === 0 ? "text-white" : "text-primary"
            }`}
            onClick={() => setSeelctedGroupType(0)}>
            정기모임
          </div>
          <div
            className={`flex-1 text-center py-3 text-sm z-20 font-medium transition-colors ${
              selectedGroupType === 1 ? "text-white" : "text-primary"
            }`}
            onClick={() => setSeelctedGroupType(1)}>
            번개모임
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGroup;
