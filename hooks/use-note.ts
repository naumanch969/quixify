import { Note } from "@prisma/client";
import { create } from "zustand";

interface Props {
  formOpen: boolean;
  viewOpen: boolean;
  note: Note | null;
  onFormOpen: () => void;
  onFormClose: () => void;
  onViewOpen: () => void;
  onViewClose: () => void;
  setNote: (note: Note | null) => void;
}

export const useNoteModal = create<Props>((set) => ({
  formOpen: false,
  viewOpen: false,
  note: null,
  onFormOpen: () => set({ formOpen: true, viewOpen: false }),
  onFormClose: () => set({ formOpen: false }),
  onViewOpen: () => set({ viewOpen: true, formOpen: false }),
  onViewClose: () => set({ viewOpen: false }),
  setNote: (note) => set({ note }),
}));
