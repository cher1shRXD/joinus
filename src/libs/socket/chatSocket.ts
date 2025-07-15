"use client";

import { io, Socket } from 'socket.io-client';
import { getCookie } from 'cookies-next';
import { ChatMessage } from '@/types/chat';

class ChatSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect() {
    if (this.socket?.connected) {
      return this.socket;
    }

    const token = getCookie('accessToken');
    if (!token) {
      console.error('No access token found for socket connection');
      return null;
    }

    this.socket = io(process.env.NEXT_PUBLIC_API_URL, {
      auth: { token },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
        this.disconnect();
      }
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinRoom(roomId: string) {
    if (!this.socket?.connected) {
      return false;
    }
    
    this.socket.emit('join-room', { roomId });
    return true;
  }

  leaveRoom(roomId: string) {
    if (!this.socket?.connected) {
      return false;
    }
    
    this.socket.emit('leave-room', { roomId });
    return true;
  }

  sendMessage(roomId: string, message: string, messageType: 'text' | 'image' = 'text', imageUrl?: string) {
    if (!this.socket?.connected) {
      return false;
    }

    this.socket.emit('send-message', {
      roomId,
      message,
      messageType,
      imageUrl
    });
    return true;
  }

  onJoinedRoom(callback: (data: { roomId: string }) => void) {
    if (!this.socket) return;
    this.socket.on('joined-room', callback);
  }

  onChatHistory(callback: (messages: ChatMessage[]) => void) {
    if (!this.socket) return;
    this.socket.on('chat-history', callback);
  }

  onNewMessage(callback: (message: ChatMessage) => void) {
    if (!this.socket) return;
    this.socket.on('new-message', callback);
  }

  onLeftRoom(callback: (data: { roomId: string }) => void) {
    if (!this.socket) return;
    this.socket.on('left-room', callback);
  }

  onError(callback: (error: string) => void) {
    if (!this.socket) return;
    this.socket.on('error', callback);
  }

  offJoinedRoom(callback: (data: { roomId: string }) => void) {
    if (!this.socket) return;
    this.socket.off('joined-room', callback);
  }

  offChatHistory(callback: (messages: ChatMessage[]) => void) {
    if (!this.socket) return;
    this.socket.off('chat-history', callback);
  }

  offNewMessage(callback: (message: ChatMessage) => void) {
    if (!this.socket) return;
    this.socket.off('new-message', callback);
  }

  offError(callback: (error: string) => void) {
    if (!this.socket) return;
    this.socket.off('error', callback);
  }

  // Remove all listeners
  removeAllListeners() {
    if (!this.socket) return;
    this.socket.removeAllListeners();
  }

  get connected() {
    return this.socket?.connected || false;
  }

  get socketId() {
    return this.socket?.id;
  }

  getSocket() {
    return this.socket;
  }
}

// Create a singleton instance
const chatSocketService = new ChatSocketService();

export default chatSocketService;