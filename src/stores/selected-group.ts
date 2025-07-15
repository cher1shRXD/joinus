import { create } from "zustand";

export interface SelectedGroupStore {
  selected: 0 | 1;
  setSelected: (selected: 0 | 1) => void;
}

export const useSelectedGroupStore = create<SelectedGroupStore>(set => ({
  selected: 1,
  setSelected: (selected) => set({selected})
}))