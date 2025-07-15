"use client";

import { useState } from "react";

const GroupTypeSelector = () => {
  const [selected, setSelected] = useState(0);

  return (
    <div className="w-full px-3 flex justify-center fixed top-16 z-50">
      <div className="w-full flex bg-white rounded-xl shadow-lg items-center relative">
        <div
          className={`absolute top-1 ${
            selected === 0 ? "left-1" : "left-[calc(50%-4px)]"
          } bg-primary h-[calc(100%-8px)] w-1/2 rounded-lg transition-all duration-300`}
        />
        <div
          className={`flex-1 text-center py-3 text-sm z-20 font-medium transition-colors ${
            selected === 0 ? "text-white" : "text-primary"
          }`}
          onClick={() => setSelected(0)}
        >
          정기모임
        </div>
        <div
          className={`flex-1 text-center py-3 text-sm z-20 font-medium transition-colors ${
            selected === 1 ? "text-white" : "text-primary"
          }`}
          onClick={() => setSelected(1)}
        >
          번개모임
        </div>
      </div>
    </div>
  );
};

export default GroupTypeSelector;
