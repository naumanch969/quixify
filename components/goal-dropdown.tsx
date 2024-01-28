"use client"

import React, { MouseEventHandler, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical } from 'lucide-react'
import { useRouter } from 'next/navigation'
import AlertModal from './modals/alert-modal'
import axios from 'axios'
import { Button } from './ui/button'



const GoalDropdown = ({ goalId }: { goalId: string }) => {

    const router = useRouter()

    const [mounted, setMounted] = useState(false)
    const [openMenu, setOpenMenu] = useState<boolean>(false)
    const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    const onDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/goal/${goalId}`)
            toast.success('Success.')
        } catch (error: any) {
            toast.error(error?.response?.data || 'Something went wrong!')
        }
        finally {
            setLoading(false)
        }
    }

    const handleChange: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.stopPropagation()
        setOpenMenu(pre => !pre)
    }

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <>
            <AlertModal
                isOpen={openDeleteModal}
                loading={loading}
                onClose={() => setOpenDeleteModal(false)}
                onConfirm={onDelete}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild className='bg-inherit border-none rounded-full w-fit' >
                    <Button variant="outline"><MoreVertical /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className=" ">
                    <DropdownMenuItem onClick={() => { router.push(`/goal/${goalId}`); setOpenMenu(false) }} >Update</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { setOpenDeleteModal(true); setOpenMenu(false) }} >Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}

export default GoalDropdown