"use client"

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Send, Image } from 'lucide-react';
import { useCustomRouter } from '@/hooks/common/useCustomRouter';
import { useChat } from '@/hooks/chat/useChat';
import { useUserStore } from '@/stores/user';
import { customFetch } from '@/libs/fetch/customFetch';
import { formatMessageTime } from '@/utils/date';
import { ChatRoom as ChatRoomType } from '@/types/chat';
import { User } from '@/types/user';

const ChatRoom = () => {
  const params = useParams();
  const roomId = params.id as string;
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [roomInfo, setRoomInfo] = useState<ChatRoomType | null>(null);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useCustomRouter();

  const { messages, isConnected, isLoading, error, sendMessage, sendImageMessage } = useChat({
    roomId,
    currentUserId: user?.uid || ''
  });



  useEffect(() => {
    if (!user) {
      const fetchUser = async () => {
        try {
          const userData = await customFetch.get<User>('/users/me');
          setUser(userData);
        } catch (error) {
          console.error('Failed to load user:', error);
        }
      };
      fetchUser();
    }
  }, [user, setUser]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => scrollToBottom(), 100);
    }
  }, [messages]);

  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      setTimeout(() => scrollToBottom(), 200);
    }
  }, [isLoading, messages.length]);

  const loadRoomInfo = useCallback(async () => {
    try {
      const rooms = await customFetch.get<ChatRoomType[]>('/chat/rooms');
      const room = rooms.find(r => r.roomId === roomId);
      setRoomInfo(room || null);
    } catch (error) {
      console.error('Failed to load room info:', error);
    }
  }, [roomId]);

  useEffect(() => {
    loadRoomInfo();
  }, [loadRoomInfo]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSend = () => {
    if (message.trim() && isConnected) {
      sendMessage(message.trim());
      setMessage('');
      setTimeout(() => scrollToBottom(), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      sendImageMessage(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (isLoading || !user) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-6 h-6 border-2 border-[#FF582A] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">
            {!user ? '사용자 정보를 로드하는 중...' : '메시지를 불러오는 중...'}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-red-500 text-xl">⚠️</span>
          </div>
          <p className="text-sm text-gray-900 font-medium mb-1">채팅을 불러올 수 없습니다</p>
          <p className="text-xs text-gray-500 mb-3">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#FF582A] text-white rounded-lg text-sm hover:bg-[#E54517] transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 px-3 py-2 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => router.push('/my-chats')}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={16} className="text-gray-700" />
          </button>
          
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 bg-[#FF582A] rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-medium">
                {roomInfo?.name.charAt(0) || '?'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-medium text-gray-900 text-sm truncate">{roomInfo?.name || '채팅'}</h1>
              {!isConnected && (
                <p className="text-xs text-red-500">연결 끊김</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Messages - Scrollable */}
      <div className="flex-1 overflow-y-auto px-2 py-3">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <p className="text-sm font-medium text-gray-900 mb-1">대화를 시작해보세요</p>
            <p className="text-xs text-gray-500">첫 메시지를 보내보세요</p>
          </div>
        ) : (
          <div className="space-y-1">
            {messages.map((msg) => {
              const isMe = user && msg.senderUid && (
                msg.senderUid === user.uid ||
                String(msg.senderUid) === String(user.uid)
              );
              
              const imageUrl = msg.imageUrl && msg.imageUrl.startsWith('/uploads')
                ? `${process.env.NEXT_PUBLIC_API_URL}${msg.imageUrl}`
                : msg.imageUrl;

              return (
                <div key={msg.messageId} className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-0.5`}>
                  <div className={`flex ${isMe ? 'flex-row-reverse' : 'flex-row'} items-end gap-1.5 max-w-[80%]`}>
                    {!isMe && (
                      <div className="w-6 h-6 bg-[#FF582A] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-medium">
                          {msg.senderNickname.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex flex-col">
                      {!isMe && (
                        <p className="text-xs text-gray-500 mb-0.5 px-1">{msg.senderNickname}</p>
                      )}
                      
                      <div className={`px-2.5 py-2 rounded-xl ${
                        isMe 
                          ? 'bg-[#FF582A] text-white rounded-br-sm' 
                          : 'bg-white text-gray-900 rounded-bl-sm border border-gray-100'
                      }`}>
                        {msg.messageType === 'text' ? (
                          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.message}</p>
                        ) : (
                          <div className="space-y-1.5">
                            <img 
                              src={imageUrl} 
                              alt="채팅 이미지" 
                              className="rounded-lg max-w-48 max-h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => window.open(imageUrl, '_blank')}
                            />
                            {msg.message && (
                              <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.message}</p>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <p className={`text-xs text-gray-400 mt-0.5 px-1 ${isMe ? 'text-right' : 'text-left'}`}>
                        {formatMessageTime(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input - Fixed */}
      <div className="flex-shrink-0 px-2 py-2 pb-6 bg-white border-t border-gray-200">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={!isConnected}
            className="w-9 h-9 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full flex items-center justify-center transition-colors disabled:opacity-50"
          >
            <Image size={18} />
          </button>
          
          <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2.5 border border-gray-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="메시지 입력..."
              disabled={!isConnected}
              className="flex-1 bg-transparent border-none resize-none focus:outline-none disabled:opacity-50 min-h-[18px] max-h-[72px] placeholder-gray-500 text-base leading-relaxed"
              rows={1}
              style={{ 
                lineHeight: '18px',
                height: '18px'
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = '18px';
                target.style.height = Math.min(target.scrollHeight, 72) + 'px';
              }}
            />
            <button
              onClick={handleSend}
              disabled={!message.trim() || !isConnected}
              className="w-9 h-9 bg-[#FF582A] text-white rounded-full flex items-center justify-center hover:bg-[#E54517] active:scale-95 transition-all disabled:opacity-50 disabled:bg-gray-300"
            >
              <Send size={18} strokeWidth={2} />
            </button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;