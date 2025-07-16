"use client"

import { useCustomRouter } from "@/hooks/common/useCustomRouter";
import { ChatRoomItemProps } from "@/types/props/chat-room-item-props";
import { formatChatTime } from "@/utils/date";

const ChatRoomItem = ({ chatRoomImage, profileImageUrl, roomId, lastMessage, memberCount, name, type, lastMessageAt, onClick }: ChatRoomItemProps) => {
  const router = useCustomRouter();


  const imageUrl = (profileImageUrl || chatRoomImage) 
    ? ((profileImageUrl || chatRoomImage)!.startsWith('/uploads') 
        ? `${process.env.NEXT_PUBLIC_API_URL}${profileImageUrl || chatRoomImage}` 
        : (profileImageUrl || chatRoomImage))
    : null;

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push(`/my-chats/${roomId}`);
    }
  };

  return (
    <div 
      className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-sm active:scale-[0.98] transition-all duration-200 cursor-pointer" 
      onClick={handleClick}
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={name} 
              className="w-full h-full object-cover" 
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <div className="flex items-center gap-2 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate text-sm">{name}</h3>
              {type === 'group' && memberCount && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md flex-shrink-0">{memberCount}</span>
              )}
            </div>
            {lastMessageAt && (
              <span className="text-xs text-gray-400 flex-shrink-0">{formatChatTime(lastMessageAt)}</span>
            )}
          </div>
          
          <p className="text-sm text-gray-600 truncate">{lastMessage || '메시지가 없습니다'}</p>
        </div>
      </div>
    </div>
  )
}

export default ChatRoomItem