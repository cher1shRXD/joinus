"use client";

import { Search } from "lucide-react";

interface SearchInputProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSearch?: () => void;
}

const SearchInput = ({ query, onQueryChange, onSearch }: SearchInputProps) => {
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch?.();
    }
  };

  return (
    <div className="w-full px-4 flex justify-center fixed top-4 z-50">
      <form onSubmit={handleSearch} className="w-full max-w-md">
        <div className="w-full flex bg-white rounded-2xl items-center pr-4 border border-gray-100">
          <input
            type="text"
            placeholder="오늘은 어떤 모임이 땡기나요?"
            className="flex-1 p-4 text-sm outline-none rounded-2xl"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button type="submit" className="p-1">
            <Search
              size={20}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            />
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchInput;
