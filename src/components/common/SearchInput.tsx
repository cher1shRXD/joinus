"use client"

import { Search } from "lucide-react";
import { useState } from "react";

const SearchInput = () => {
  const [query, setQuery] = useState("");

  return (
    <div className="w-full px-3 flex justify-center fixed top-3 z-50">
      <div className="w-full flex bg-white rounded-xl shadow-lg items-center pr-3">
        <input type="text" placeholder="오늘은 어떤 모임이 땡기나요?" className="flex-1 p-3 text-sm outline-none" />
        <Search size={20} className="text-primary" />
      </div>
    </div>
  )
}

export default SearchInput