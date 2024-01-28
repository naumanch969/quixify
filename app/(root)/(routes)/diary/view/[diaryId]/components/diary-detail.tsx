"use client"

import { Badge } from '@/components/ui/badge'
import { Heading } from '@/components/ui/heading'
import { MountedContainer } from '@/components/ui/mounted-container'
import { Diary } from '@prisma/client'
import { differenceInCalendarDays, differenceInCalendarMonths, format } from 'date-fns'
import React, { useEffect, useState } from 'react'

const DiaryDetail = ({ diary }: { diary: Diary }) => {



    return (
        <MountedContainer>
            <div className="space-y-4 ">
                <div className="text-sm flex justify-between items-center gap-x-2 ">
                    <p className="">{format(diary.day, "PPP")}</p>
                </div>

                <div className="flex justify-between items-start gap-x-2">

                    <Badge variant="default" className="w-fit" >
                        {format(diary?.day, "PPP")}
                    </Badge>
                </div>

                <p className='text-sm text-muted-foreground' >{diary?.description}</p>
            </div>
        </MountedContainer>
    )
}

export default DiaryDetail