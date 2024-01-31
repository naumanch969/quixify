"use client"

import React, { useEffect, useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { MountedContainer } from '../ui/mounted-container'
import { useQuoteModal } from '@/hooks/use-quote'


const QuoteViewModal = () => {

    const { viewOpen, onViewClose } = useQuoteModal()


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

export default QuoteViewModal