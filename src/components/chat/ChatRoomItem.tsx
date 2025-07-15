"use client"

import { useCustomRouter } from "@/hooks/common/useCustomRouter";
import { ChatRoomItemProps } from "@/types/props/chat-room-item-props"

const ChatRoomItem = ({ chatRoomImage, id, lastMessage, memberCount, name }: ChatRoomItemProps) => {
  const router = useCustomRouter();

  return (
    <div className="w-full py-2 flex itemes-center gap-4" onClick={() => router.push(`/my-chats/${id}`) }>
      <img src={chatRoomImage} className="bg-gray-300 w-16 h-16 rounded-full" />
      <div className="flex-1 h-full flex flex-col justify-center">
        <div className="flex items-center gap-2">
          <p className="font-bold text-lg">{name.length > 20 ? name.slice(0, 20) + "..." : name}</p>
          <p className="text-sm text-gray-500">{memberCount}</p>
        </div>
        <p className="text-sm text-gray-400">{lastMessage.length > 50 ? lastMessage.slice(0, 50) + "..." : lastMessage}</p>
      </div>
    </div>
  )
}

export default ChatRoomItem