import { Idea } from "@prisma/client";
import { create } from "zustand";

interface Props {
  formOpen: boolean;
  viewOpen: boolean;
  idea: Idea | null;
  // draft: Idea | null;  // TODO
  onFormOpen: () => void;
  onFormClose: () => void;
  onViewOpen: () => void;
  onViewClose: () => void;
  setIdea: (idea: Idea | null) => void;
}

export const useIdeaModal = create<Props>((set) => ({
  formOpen: false,
  viewOpen: false,
  idea: null,
  onFormOpen: () => set({ formOpen: true, viewOpen: false }),
  onFormClose: () => set({ formOpen: false }),
  onViewOpen: () => set({ viewOpen: true, formOpen: false }),
  onViewClose: () => set({ viewOpen: false }),
  setIdea: (idea) => set({ idea }),
}));
