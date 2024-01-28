import { PopulatedDiary } from "@/interfaces";
import { Diary } from "@prisma/client";
import { create } from "zustand";

interface Props {
  isOpen: boolean;
  diary: PopulatedDiary | Diary | null;
  onOpen: () => void;
  onClose: () => void;
  setDiary: (diary: Diary | null) => void;
}

export const useDiaryModal = create<Props>((set) => ({
  isOpen: false,
  diary: null,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  setDiary: (diary) => set({ diary }),
}));
