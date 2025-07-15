"use client";

import { useSelectedGroupStore } from "@/stores/selected-group";

const GroupTypeSelector = () => {

  const { selected, setSelected } = useSelectedGroupStore();

  return (
    <div className="w-full px-4 flex justify-center fixed top-20 z-50">
      <div className="w-full max-w-md flex bg-white rounded-2xl items-center relative border border-gray-100">
        <div
          className={`absolute top-1 ${
            selected === 1 ? "left-1" : "left-[calc(50%-4px)]"
          } bg-primary h-[calc(100%-8px)] w-1/2 rounded-xl transition-all duration-300`}
        />
        <button
          className={`flex-1 text-center py-3 text-sm z-20 font-medium transition-colors ${
            selected === 1 ? "text-white" : "text-gray-600"
          }`}
          onClick={() => setSelected(1)}
        >
          번개모임
        </button>
        <button
          className={`flex-1 text-center py-3 text-sm z-20 font-medium transition-colors ${
            selected === 0 ? "text-white" : "text-gray-600"
          }`}
          onClick={() => setSelected(0)}
        >
          정기모임
        </button>
      </div>
    </div>
  );
};

export default GroupTypeSelector;
