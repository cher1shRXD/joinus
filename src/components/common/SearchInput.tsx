"use client"

import { Search } from "lucide-react";
import { useState } from "react";

const SearchInput = () => {
  const [query, setQuery] = useState("");

  return (
    <div className="w-full px-4 flex justify-center fixed top-4 z-50">
      <div className="w-full max-w-md flex bg-white rounded-2xl items-center pr-4 border border-gray-100">
        <input 
          type="text" 
          placeholder="오늘은 어떤 모임이 땡기나요?" 
          className="flex-1 p-4 text-sm outline-none rounded-2xl" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Search size={20} className="text-gray-400" />
      </div>
    </div>
  )
}

export default SearchInput