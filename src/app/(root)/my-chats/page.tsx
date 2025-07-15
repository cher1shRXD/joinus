"use client"

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { useCustomRouter } from '@/hooks/common/useCustomRouter';
import { customFetch } from '@/libs/fetch/customFetch';
import ChatRoomItem from '@/components/chat/ChatRoomItem';
import { ChatRoom } from '@/types/chat';

const MyChats = () => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useCustomRouter();

  useEffect(() => {
    loadChatRooms();
  }, []);

  const loadChatRooms = async () => {
    try {
      const rooms = await customFetch.get<ChatRoom[]>('/chat/rooms');
      setChatRooms(rooms);
    } catch (error) {
      console.error('Failed to load chat rooms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRooms = chatRooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChatRoomClick = (roomId: string) => {
    router.push(`/chat/${roomId}`);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="w-6 h-6 border-2 border-[#FF582A] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="mb-4">
          <h1 className="text-xl font-semibold text-gray-900">채팅</h1>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="채팅방 검색"
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-full focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FF582A]/20 text-sm"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredRooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-6 text-center">
            <p className="text-lg font-medium text-gray-900 mb-2">채팅방이 없습니다</p>
            <p className="text-sm text-gray-500">프로필에서 채팅하기를 눌러 대화를 시작해보세요</p>
          </div>
        ) : (
          <div className="px-2 py-2">
            {filteredRooms.map((room) => (
              <ChatRoomItem
                key={room.roomId}
                roomId={room.roomId}
                name={room.name}
                lastMessage={room.lastMessage}
                lastMessageAt={room.lastMessageAt}
                profileImageUrl={room.profileImageUrl}
                onClick={() => handleChatRoomClick(room.roomId)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyChats;