"use client"

import React, { useEffect, useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { MountedContainer } from '../ui/mounted-container'

type Props = {
    isOpen: boolean,
    onClose: () => void,
    onConfirm: () => void,
    loading: boolean
}

const AlertModal = ({ isOpen, onClose, onConfirm, loading }: Props) => {

 
    return (
        <MountedContainer>
            <Modal
                title='Are you sure?'
                description='This action can not be undone.'
                isOpen={isOpen}
                onClose={onClose}
            >
                <div className="pt-6 space-x-2 flex items-center justify-end w-full ">
                    <Button
                        disabled={loading}
                        variant='outline'
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={loading}
                        variant='destructive'
                        onClick={onConfirm}
                    >
                        Continue
                    </Button>
                </div>

            </Modal>
        </MountedContainer>
    )
}

export default AlertModal