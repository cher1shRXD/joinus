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
