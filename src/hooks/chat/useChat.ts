"use client"

import { useEffect, useState, useCallback } from 'react';
import { ChatMessage } from '@/types/chat';
import chatSocketService from '@/libs/socket/chatSocket';
import { customFetch } from '@/libs/fetch/customFetch';

interface UseChatProps {
  roomId: string;
  currentUserId: string;
}

export const useChat = ({ roomId }: UseChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const loadMessages = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const chatMessages = await customFetch.get<ChatMessage[]>(`/chat/rooms/${roomId}/messages`);
        if (isMounted) {
          setMessages(chatMessages);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Failed to load messages:', error);
        if (isMounted) {
          setError('메시지를 불러오는데 실패했습니다');
          setIsLoading(false);
        }
      }
    };

    const socket = chatSocketService.connect();
    if (!socket) {
      setError('채팅 서버에 연결할 수 없습니다');
      setIsLoading(false);
      return;
    }

    setIsConnected(socket.connected);
    
    const handleConnect = () => {
      if (isMounted) {
        setIsConnected(true);
        setError(null);
        chatSocketService.joinRoom(roomId);
      }
    };

    const handleDisconnect = () => {
      if (isMounted) {
        setIsConnected(false);
      }
    };

    const handleJoinedRoom = (data: { roomId: string }) => {
      if (isMounted && data.roomId === roomId) {
        console.log('Joined room:', data.roomId);
      }
    };

    const handleChatHistory = (chatHistory: ChatMessage[]) => {
      if (isMounted) {
        setMessages((prev) => prev.length > 0 ? prev : chatHistory);
        setIsLoading(false);
        setError(null);
      }
    };

    const handleNewMessage = (newMessage: ChatMessage) => {
      if (isMounted && newMessage.roomId === roomId) {
        setMessages((prev) => {
          const exists = prev.some(msg => msg.messageId === newMessage.messageId);
          return exists ? prev : [...prev, newMessage];
        });
      }
    };

    const handleError = (error: string) => {
      console.error('Chat error:', error);
      if (isMounted) {
        setError(error);
      }
    };

    if (socket.connected) {
      chatSocketService.joinRoom(roomId);
    }

    chatSocketService.onJoinedRoom(handleJoinedRoom);
    chatSocketService.onChatHistory(handleChatHistory);
    chatSocketService.onNewMessage(handleNewMessage);
    chatSocketService.onError(handleError);

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    loadMessages();

    return () => {
      isMounted = false;
      chatSocketService.leaveRoom(roomId);
      
      chatSocketService.offJoinedRoom(handleJoinedRoom);
      chatSocketService.offChatHistory(handleChatHistory);
      chatSocketService.offNewMessage(handleNewMessage);
      chatSocketService.offError(handleError);
      
      if (socket) {
        socket.off('connect', handleConnect);
        socket.off('disconnect', handleDisconnect);
      }
    };
  }, [roomId]);

  const sendMessage = useCallback((message: string) => {
    if (isConnected && message.trim()) {
      chatSocketService.sendMessage(roomId, message, 'text');
    }
  }, [roomId, isConnected]);

  const sendImageMessage = useCallback(async (file: File, caption?: string) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      const { imageUrl } = await customFetch.post<{ imageUrl: string }>('/upload', formData);
      if (isConnected) {
        chatSocketService.sendMessage(roomId, caption || '', 'image', imageUrl);
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
    }
  }, [roomId, isConnected]);

  return {
    messages,
    isConnected,
    isLoading,
    error,
    sendMessage,
    sendImageMessage
  };
};