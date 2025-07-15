import { Place } from "@/types/place";
import { create } from "zustand";

interface PlaceState {
  place: Place | null;
  setPlace: (place: Place | null) => void;
}

export const usePlaceStore = create<PlaceState>((set) => ({
  place: null,
  setPlace: (place) => set({ place }),
}));
