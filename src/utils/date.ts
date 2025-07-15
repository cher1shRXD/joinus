import { FirebaseTimestamp } from '@/types/chat';

export const parseFirebaseTimestamp = (timestamp: FirebaseTimestamp | string): Date => {
  if (typeof timestamp === 'string') {
    return new Date(timestamp);
  }
  
  if (timestamp && typeof timestamp === 'object' && '_seconds' in timestamp) {
    return new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000);
  }
  
  return new Date();
};

export const formatChatTime = (timestamp: FirebaseTimestamp | string): string => {
  const date = parseFirebaseTimestamp(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMins < 1) return '방금';
  if (diffMins < 60) return `${diffMins}분`;
  if (diffHours < 24) return `${diffHours}시간`;
  if (diffDays < 7) return `${diffDays}일`;
  return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
};

export const formatMessageTime = (timestamp: FirebaseTimestamp | string): string => {
  const date = parseFirebaseTimestamp(timestamp);
  return date.toLocaleTimeString('ko-KR', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false
  });
};