import { Meeting } from "@/types/meeting";
import { create } from "zustand";

interface MeetingState {
  meeting: Meeting | null;
  setMeeting  : (meeting: Meeting | null) => void;
}

export const useMeetingStore = create<MeetingState>((set) => ({
  meeting: null,
  setMeeting: (meeting) => set({ meeting }),
}));
