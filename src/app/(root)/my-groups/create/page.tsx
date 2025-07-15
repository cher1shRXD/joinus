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

        {/* Image Upload Section */}
        <div className="mt-6">
          <p className="text-base font-semibold mb-2">이미지 업로드</p>
          <div className="flex gap-3">
            <div className="w-24 h-24 bg-gray-300 rounded-lg flex items-center justify-center text-gray-600">
              이미지
            </div>
            <div className="w-24 h-24 bg-gray-300 rounded-lg flex items-center justify-center text-gray-600 text-3xl">
              +
            </div>
          </div>
        </div>

        {/* Group Name Input */}
        <div className="mt-6">
          <p className="text-base font-semibold mb-2">모임명</p>
          <input
            type="text"
            placeholder="내용을 입력"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
          />
        </div>

        {/* Description Textarea */}
        <div className="mt-6">
          <p className="text-base font-semibold mb-2">설명</p>
          <textarea
            placeholder="모임 설명을 입력"
            rows={5}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary resize-none"
          ></textarea>
        </div>

        {/* Category Dropdown */}
        <div className="mt-6">
          <p className="text-base font-semibold mb-2">카테고리</p>
          <select className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white pr-8 focus:outline-none focus:border-primary">
            <option>운동/헬스</option>
            {/* Add more options here */}
          </select>
        </div>

        {/* Create Button */}
        <div className="mt-8">
          <button className="w-full bg-black text-white py-4 rounded-lg text-lg font-semibold">
            생성 완료
          </button>
        </div>

        {/* Approval Section */}
        <div className="mt-6">
          <p className="text-base font-semibold mb-2">승인 여부</p>
          <input
            type="text"
            placeholder="승인 후 가입 허용"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
          />
        </div>
      </div>
    </div>
  );
};

export default CreateGroup;
