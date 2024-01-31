"use client"

import ProgressModal from "@/components/modals/progress-modal"
import { MountedContainer } from "@/components/ui/mounted-container"
import NoteFormModal from "@/components/modals/note-form-modal"
import NoteViewModal from "@/components/modals/note-view-modal"
import IdeaFormModal from "@/components/modals/idea-form-modal"
import IdeaViewModal from "@/components/modals/idea-view-modal"
import QuoteFormModal from "@/components/modals/quote-form-modal"
import QuoteViewModal from "@/components/modals/quote-view-modal"
import DiaryFormModal from "@/components/modals/diary-form-modal"

export const ModalProvider = () => {
    return (
        <MountedContainer>
            <ProgressModal />
            <NoteFormModal />
            <NoteViewModal />
            <IdeaFormModal />
            <IdeaViewModal />
            <QuoteFormModal />
            <QuoteViewModal />
            <DiaryFormModal />
        </MountedContainer>
    )
}