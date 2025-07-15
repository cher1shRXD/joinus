import { FirebaseTimestamp } from '@/types/chat';

export interface ChatRoomItemProps {
  roomId: string;
  name: string;
  memberCount?: number;
  lastMessage?: string;
  chatRoomImage?: string;
  type?: 'group' | 'direct';
  lastMessageAt?: FirebaseTimestamp | string;
  profileImageUrl?: string;
  onClick?: () => void;
}