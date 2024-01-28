"use client"

import { useEffect, useState } from "react"

import ProgressModal from "@/components/modals/progress-modal"
import { MountedContainer } from "@/components/ui/mounted-container"
import NoteFormModal from "@/components/modals/note-form-modal"
import NoteViewModal from "@/components/modals/note-view-modal"
import IdeaFormModal from "@/components/modals/idea-form-modal"
import IdeaViewModal from "@/components/modals/idea-view-modal"

export const ModalProvider = () => {


    return (
        <MountedContainer>
            <ProgressModal />
            <NoteFormModal />
            <NoteViewModal />
            <IdeaFormModal />
            <IdeaViewModal />
        </MountedContainer>
    )
}