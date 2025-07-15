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
}

export interface RegularMeeting extends MeetingBase {
  photos: string[];
  category: string;
  requiresApproval: boolean;
  status: "active" | "inactive";
}

export interface OneTimeMeeting extends MeetingBase {
  startTime: string;
  expectedDurationMinutes: number;
  memberLimit: number;
}

export type Meeting = RegularMeeting | OneTimeMeeting;
