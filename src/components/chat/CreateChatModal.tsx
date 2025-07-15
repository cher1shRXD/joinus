"use client";

import { useState } from "react";
import { X, Search, MessageSquare } from "lucide-react";
import { useCustomRouter } from "@/hooks/common/useCustomRouter";
import { customFetch } from "@/libs/fetch/customFetch";

interface CreateChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChatCreated?: () => void;
}

interface User {
  uid: string;
  nickname: string;
  profileImageUrl?: string;
}

const CreateChatModal = ({ isOpen, onClose, onChatCreated }: CreateChatModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useCustomRouter();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const data = await customFetch.get<{ users: User[] }>(
        `/search/users?query=${encodeURIComponent(searchQuery)}`
      );
      setSearchResults(data.users || []);
    } catch (error) {
      console.error("Failed to search users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateChat = async (targetUserId: string) => {
    try {
      const { roomId } = await customFetch.post<{ roomId: string }>('/chat/direct', { targetUserId });
      onClose();
      onChatCreated?.();
      router.push(`/chat/${roomId}`);
    } catch (error) {
      console.error("Failed to create chat:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">새 채팅</h2>
          <button 
            onClick={onClose} 
            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 border-b border-gray-100">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="닉네임으로 검색"
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-full focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#FF582A] placeholder-gray-500"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={!searchQuery.trim() || isLoading}
              className="w-12 h-12 bg-[#FF582A] text-white rounded-full flex items-center justify-center hover:bg-[#E54517] transition-colors disabled:opacity-50"
            >
              <Search size={18} strokeWidth={2} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="w-5 h-5 border-2 border-[#FF582A] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center px-6">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <MessageSquare size={20} className="text-gray-400" />
              </div>
              <p className="text-base font-medium text-gray-900 mb-1">검색 결과가 없습니다</p>
              <p className="text-sm text-gray-500">다른 닉네임으로 검색해보세요</p>
            </div>
          ) : (
            <div className="p-4">
              {searchResults.map((user) => {
                const imageUrl = user.profileImageUrl && user.profileImageUrl.startsWith('/uploads')
                  ? `${process.env.NEXT_PUBLIC_API_URL}${user.profileImageUrl}`
                  : user.profileImageUrl;

                return (
                  <div
                    key={user.uid}
                    onClick={() => handleCreateChat(user.uid)}
                    className="flex items-center gap-3 p-4 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors"
                  >
                    <div className="w-12 h-12 bg-[#FF582A] rounded-full flex items-center justify-center overflow-hidden">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={user.nickname}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-medium">
                          {user.nickname.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{user.nickname}</p>
                      <p className="text-sm text-gray-500">채팅 시작하기</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateChatModal;
