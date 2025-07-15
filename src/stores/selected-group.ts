import { create } from "zustand";

export interface SelectedGroupStore {
  selected: 0 | 1;
  setSelected: (selected: 0 | 1) => void;
}

export const useSelectedGroupStore = create<SelectedGroupStore>(set => ({
  selected: 0,
  setSelected: (selected) => set({selected})
}))