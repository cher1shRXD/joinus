export interface FirebaseTimestamp {
  _seconds: number;
  _nanoseconds: number;
}

export interface ChatMessage {
  messageId: string;
  roomId: string;
  senderUid: string;
  senderNickname: string;
  message: string;
  messageType: "text" | "image";
  imageUrl?: string;
  createdAt: FirebaseTimestamp | string;
}

export interface ChatRoom {
  roomId: string;
  name: string;
  type: "group" | "direct";
  participants: string[];
  meetingId?: string;
  meetingType?: "regular" | "flash";
  lastMessage?: string;
  lastMessageAt?: FirebaseTimestamp | string;
  profileImageUrl?: string;
  createdAt: FirebaseTimestamp | string;
  updatedAt: FirebaseTimestamp | string;
}

export interface ChatRoomListItem extends ChatRoom {
  memberCount?: number;
  chatRoomImage?: string;
}

export interface SendMessageData {
  roomId: string;
  message: string;
  messageType: "text" | "image";
  imageUrl?: string;
}

export interface SocketEvents {
  // Client → Server
  "join-room": { roomId: string };
  "send-message": SendMessageData;
  "leave-room": { roomId: string };

  // Server → Client
  "joined-room": { roomId: string };
  "chat-history": ChatMessage[];
  "new-message": ChatMessage;
  "left-room": { roomId: string };
  error: string;
}

export interface CreateDirectChatRequest {
  targetUserId: string;
}

export interface CreateDirectChatResponse {
  roomId: string;
}

export interface ChatUser {
  uid: string;
  nickname: string;
  profileImageUrl?: string;
}
