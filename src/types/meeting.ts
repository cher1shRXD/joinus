interface MeetingBase {
  meetingId: string;
  name: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
    addressString: string;
  };
  organizerUid: string;
  members: string[];
  createdAt: string;
  updatedAt: string;
  category: string;
  type: string;
  isMember: boolean
  amount: number;
}

export interface RegularMeeting extends MeetingBase {
  photos: string[];
  requiresApproval: boolean;
  status: "active" | "inactive";
}

export interface FlashMeeting extends MeetingBase {
  startTime: {
    _seconds: number;
    _nanoseconds: number;
  };
  expectedDurationMinutes: number;
  memberLimit: number;
}

export type Meeting = RegularMeeting | FlashMeeting;

export const CATEGORIES = [
  { id: 'all', name: '전체', icon: 'all' },
  { id: '운동/스포츠', name: '운동/스포츠', icon: 'fitness' },
  { id: '자기계발', name: '자기계발', icon: 'selfDevelopment' },
  { id: '인문학/책/글', name: '인문학/책/글', icon: 'book' },
  { id: '외국/언어', name: '외국/언어', icon: 'language' },
  { id: '음악/악기', name: '음악/악기', icon: 'music' },
  { id: '스포츠관람', name: '스포츠관람', icon: 'sports' },
  { id: '아웃도어/여행', name: '아웃도어/여행', icon: 'outdoor' },
  { id: '업종/직무', name: '업종/직무', icon: 'work' },
  { id: '문화/공연', name: '문화/공연', icon: 'culture' },
  { id: '공예/만들기', name: '공예/만들기', icon: 'craft' },
  { id: '댄스/무용', name: '댄스/무용', icon: 'dance' },
  { id: '봉사활동', name: '봉사활동', icon: 'volunteer' },
  { id: '사교/인맥', name: '사교/인맥', icon: 'networking' },
  { id: '차/바이크', name: '차/바이크', icon: 'vehicle' },
  { id: '사진/영상', name: '사진/영상', icon: 'photo' },
  { id: '게임/오락', name: '게임/오락', icon: 'game' },
  { id: '요리/제조', name: '요리/제조', icon: 'cooking' },
  { id: '반려동물', name: '반려동물', icon: 'pet' },
] as const;
