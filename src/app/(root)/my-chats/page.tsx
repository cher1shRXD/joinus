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
      <div className="max-w-md mx-auto bg-gray-50 min-h-screen">
        <div className="bg-white p-4">
          <h1 className="text-xl font-bold text-gray-900">채팅</h1>
        </div>
        <div className="flex justify-center py-12">
          <div className="text-gray-500">채팅방을 불러오는 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen">
      <div className="bg-white p-4">
        <h1 className="text-xl font-bold text-gray-900 mb-4">채팅</h1>
        
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="채팅방 검색"
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
          />
        </div>
      </div>

      <div className="p-4">
        {filteredRooms.length === 0 ? (
          <div className="flex flex-col items-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <div className="text-gray-400 text-2xl">💬</div>
            </div>
            <div className="text-gray-500 text-center">
              <p className="font-medium mb-1">채팅방이 없습니다</p>
              <p className="text-sm text-gray-400">새로운 대화를 시작해보세요</p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
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