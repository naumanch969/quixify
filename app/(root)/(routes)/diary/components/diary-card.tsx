"use client"

import React, { useState } from 'react'
import { Diary } from '@prisma/client'
import { differenceInCalendarDays, differenceInCalendarMonths, format } from 'date-fns'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "../../../../../components/ui/badge";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import { MountedContainer } from '@/components/ui/mounted-container';
import toast from 'react-hot-toast';
import AlertModal from '@/components/modals/alert-modal';
import { useDiaryModal } from '@/hooks/use-diary';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { progressColors } from '@/lib/utils';

const DiaryCard = ({ diary }: { diary: Diary }) => {

    const { onFormOpen, setDiary } = useDiaryModal()
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const onDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/diary/${diary.id}`)
            router.refresh()
            setOpen(false)
            toast.success('Success!')
        } catch (error: any) {
            toast.error(error?.response?.data || "Something went wrong!")
        } finally {
            setLoading(false)
        }
    }

    const onUpdateClick = () => {
        onFormOpen()
        setDiary(diary)
    }

    return (
        <MountedContainer>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            <Card className="min-h-[18rem] bg-primary/10 rounded-xl border-0 transition flex flex-col justify-between ">
                <div className="flex flex-col">
                    <CardHeader className="flex flex-col gap-4 justify-start items-center text-muted-foreground  ">
                        {/* progress bar */}
                        <div className="relative flex justify-start w-full h-[4px] rounded-full bg-white ">
                            <div className="w-full h-full rounded-full " style={{
                                width: `${diary.productivity}%`,
                                background: diary.productivity >= 80 ? progressColors[100] : diary.productivity >= 60 ? progressColors[80] : diary.productivity >= 40 ? progressColors[60] : diary.productivity >= 20 ? progressColors[40] : progressColors[20]
                            }} />
                            <span
                                className="w-[22px] h-[22px] text-[11px] border text-black flex justify-center items-center rounded-full p-1 bg-white absolute "
                                style={{ transform: `translate(-50%,-${50}%)`, left: `${diary.productivity}%`, top: '50%', border: diary.productivity >= 80 ? progressColors[100] : diary.productivity >= 60 ? progressColors[80] : diary.productivity >= 40 ? progressColors[60] : diary.productivity >= 20 ? progressColors[40] : progressColors[20] }}
                            >
                                {diary.productivity}
                            </span>
                        </div>

                        {/* Badge */}
                        <div className="w-full flex justify-start">
                            <Badge variant="outline" className="w-fit" >
                                {format(diary.day, "PPP")}
                            </Badge>
                        </div>

                        {/* Title */}
                        <CardTitle className="text-white w-full text-start capitalize hover:opacity-80 " >
                            {
                                diary.main.map((text, index) => (
                                    <Link
                                        key={index}
                                        href={`/diary/view/${diary.id}`}
                                        className='flex items-center gap-x-2 text-lg '
                                    >
                                        <span className='w-4 h-4 rounded-full bg-white' /> {text}
                                    </Link>
                                ))
                            }
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <CardDescription className="text-xs text-start">
                            {diary.description}
                        </CardDescription>
                    </CardContent>
                </div>

                <CardFooter className='flex justify-end items-center gap-x-2 ' >
                    <Button onClick={onUpdateClick} size='icon' variant='secondary' ><Edit /></Button>
                    <Button onClick={() => setOpen(true)} size='icon' variant='destructive' ><Trash /></Button>
                </CardFooter>
            </Card>
        </MountedContainer>
    )
}

export default DiaryCard