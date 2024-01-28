"use client"
import React, { useEffect, useState } from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { PopulatedGoal } from '@/interfaces'
import { Button } from '@/components/ui/button'
import { useProgressModal } from '@/hooks/use-progress'
import { MONTHS, progressColors } from '@/lib/utils'
import { ArrowUpDown, Trash, } from 'lucide-react'
import { Progress } from '@prisma/client'
import { MountedContainer } from '@/components/ui/mounted-container'
import { isAfter } from 'date-fns'
import { Badge } from '@/components/ui/badge'


const GoalAccordian = ({ goal }: { goal: PopulatedGoal }) => {

    const progressModal = useProgressModal()

    const onClick = (progress?: Progress) => {
        progressModal.onOpen()
        progressModal.setGoal(goal, progress ? progress : null)
    }

    return (
        <MountedContainer>
            <div className='space-y-4 px-4 ' >

                <div className="space-y-2 bg-background p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                        <h4 className='font-medium' >What you have done each day</h4>
                    </div>

                    <Accordion type="single" collapsible className='w-full ' >
                        {goal.progress.length == 0 &&
                            <AccordionItem value='' className='w-full text-center border-none py-4 bg-muted rounded-md '>No Progress Found!</AccordionItem>
                        }
                        {
                            goal.progress.reverse().map((p, index) => (
                                <AccordionItem value={p.workDone + p.day} key={index}>
                                    <AccordionTrigger disabled={isAfter(p.day, new Date())} className='px-2 flex justify-between items-center bg-background disabled:bg-opacity-50 ' >
                                        <div className="flex justify-start gap-x-4 ">
                                            {goal.type == 'daily' && `${MONTHS[p.day.getMonth()]} ${p.day.getDate()}`}
                                            {goal.type == 'weekly' && `${MONTHS[p.day.getMonth()]} ${p.day.getDate()}`}
                                            {goal.type == 'monthly' && `${MONTHS[p.day.getMonth()]} ${p.day.getDate()}`}
                                            {goal.type == 'yearly' && `${MONTHS[p.day.getMonth()]} ${p.day.getFullYear()}`}
                                            <Badge variant='secondary'
                                                style={{
                                                    background: isAfter(p.day, new Date())
                                                        ? progressColors['disabled']
                                                        : p.percentage < 20 ? progressColors[20]
                                                            : p.percentage < 40 ? progressColors[40]
                                                                : p.percentage < 60 ? progressColors[60]
                                                                    : p.percentage < 80 ? progressColors[80]
                                                                        : progressColors[100]
                                                }}
                                            >{p.percentage}</Badge>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className='bg-muted p-2 rounded-md flex justify-between items-start gap-x-2' >
                                        <span>{p.workDone}</span>
                                        <div className="space-x-2 ">
                                            <Button
                                                variant='outline' size='icon' className='hover:bg-opacity-75 hover:bg-black'
                                                onClick={() => onClick(p)}
                                            ><ArrowUpDown /></Button>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))
                        }
                    </Accordion>

                </div>

            </div>
        </MountedContainer>
    )
}

export default GoalAccordian