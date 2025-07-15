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
      className="flex items-center gap-3 p-3 mx-2 rounded-2xl hover:bg-gray-50 cursor-pointer transition-colors" 
      onClick={handleClick}
    >
      <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full bg-[#FF582A] flex items-center justify-center">
            <span className="text-white text-lg font-medium">
              {name.charAt(0)}
            </span>
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2 min-w-0">
            <h3 className="font-medium text-gray-900 truncate text-base">{name}</h3>
            {type === 'group' && memberCount && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{memberCount}</span>
            )}
          </div>
          {lastMessageAt && (
            <span className="text-xs text-gray-400 ml-2 flex-shrink-0">{formatChatTime(lastMessageAt)}</span>
          )}
        </div>
        
        <p className="text-sm text-gray-500 truncate">{lastMessage || '메시지가 없습니다'}</p>
      </div>
    </div>
  )
}

export default ChatRoomItem