import { Quote } from "@prisma/client";
import { create } from "zustand";

interface Props {
  formOpen: boolean;
  viewOpen: boolean;
  quote: Quote | null;
  onFormOpen: () => void;
  onFormClose: () => void;
  onViewOpen: () => void;
  onViewClose: () => void;
  setQuote: (quote: Quote | null) => void;
}

export const useQuoteModal = create<Props>((set) => ({
  formOpen: false,
  viewOpen: false,
  quote: null,
  onFormOpen: () => set({ formOpen: true, viewOpen: false }),
  onFormClose: () => set({ formOpen: false }),
  onViewOpen: () => set({ viewOpen: true, formOpen: false }),
  onViewClose: () => set({ viewOpen: false }),
  setQuote: (quote) => set({ quote }),
}));
