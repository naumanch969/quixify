import { Goal, Progress } from "@prisma/client";
import { create } from "zustand";

interface Props {
  isOpen: boolean;
  goal: Goal | null;
  progress: Progress | null;
  onOpen: () => void;
  onClose: () => void;
  setGoal: (goal: Goal, progress: Progress | null) => void;
}

export const useProgressModal = create<Props>((set) => ({
  isOpen: false,
  goal: null,
  progress: null,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  setGoal: (goal, progress) =>
    set({ goal, progress: progress ? progress : null }),
}));
