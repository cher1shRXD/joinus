import { Survey } from "@/types/survey";
import { create } from "zustand";

interface SurveyStore {
  data: Survey | null;
  setData: (data: Survey | null) => void;
}

export const useSurveyStore = create<SurveyStore>(set => ({
  data: null,
  setData: (data) => set({ data })
}))