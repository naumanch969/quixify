"use client"

import React from 'react'
import { Modal } from '@/components/ui/modal'
import { MountedContainer } from '../ui/mounted-container'
import { useNoteModal } from '@/hooks/use-note'

const IdeaViewModal = () => {

    const { viewOpen, onViewClose } = useNoteModal()

    return (
        <MountedContainer>
            <Modal
                title='Are you sure?'
                description='This action can not be undone.'
                isOpen={viewOpen}
                onClose={onViewClose}
            >
                <div className="pt-6 space-x-2 flex items-center justify-end w-full ">

                </div>
            </Modal>
        </MountedContainer>
    )
}

export default IdeaViewModal