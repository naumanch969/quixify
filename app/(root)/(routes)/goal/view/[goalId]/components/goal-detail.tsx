"use client"

import { Badge } from '@/components/ui/badge'
import { Heading } from '@/components/ui/heading'
import { MountedContainer } from '@/components/ui/mounted-container'
import { Goal } from '@prisma/client'
import { differenceInCalendarDays, differenceInCalendarMonths, format } from 'date-fns'
import React, { useEffect, useState } from 'react'

const GoalDetail = ({ goal }: { goal: Goal }) => {

    const daysLeft = differenceInCalendarDays(goal?.deadline, new Date())
    const monthsLeft = differenceInCalendarMonths(goal?.deadline, new Date())




    return (
        <MountedContainer>
            <div className="space-y-4 ">
                <div className="text-sm flex justify-between items-center gap-x-2 ">
                    <p className="">{format(goal.start, "PPP")} - {format(goal.deadline, "PPP")}</p>
                    <p className="">{
                        daysLeft < 0
                            ? <span className="text-red-500" >Deadline Exceeded</span>
                            : `${daysLeft > 31 ? monthsLeft + ' months' : daysLeft + ' days'}  to deadline`
                    }</p>
                </div>

                <div className="flex justify-between items-start gap-x-2">
                    <Heading title={goal?.goal} description={goal?.description} />
                    <Badge variant="default" className="w-fit" >
                        {goal?.type}
                    </Badge>
                </div>

                <div className="">
                    <h4 className='font-medium' >Purpose (WHY)</h4>
                    <p className='text-sm text-muted-foreground' >{goal?.purpose}</p>
                </div>
                <div className="">
                    <h4 className='font-medium' >Impact (RESULT)</h4>
                    <p className='text-sm text-muted-foreground' >{goal?.impact}</p>
                </div>
            </div>
        </MountedContainer>
    )
}

export default GoalDetail