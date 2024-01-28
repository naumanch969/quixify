import React from 'react'
import { Goal, Progress } from '@prisma/client'
import { addDays, addMonths, addWeeks, addYears, differenceInCalendarDays, differenceInCalendarMonths, differenceInCalendarYears, differenceInDays, differenceInHours, differenceInMonths, differenceInWeeks, differenceInYears, format } from 'date-fns'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "../../../../../components/ui/badge";
import Link from 'next/link';
import { PopulatedGoal } from '@/interfaces';
import { getPassedDurationPercentage } from './utils';

const GoalCard = ({ goal }: { goal: PopulatedGoal }) => {


    const passedPercentage = getPassedDurationPercentage(goal)

    const progressPercentage = goal?.progress?.reduce((total: number, item: Progress) => {
        return total + (item.percentage / 100);
    }, 0);

    const daysLeft = differenceInCalendarDays(goal.deadline, new Date())
    const monthsLeft = differenceInCalendarMonths(goal.deadline, new Date())

    return (
        <Card className="bg-primary/10 rounded-xl border-0 transition flex flex-col justify-between "            >

            <div className="flex flex-col">
                <CardHeader className="flex flex-col gap-4 justify-start items-center text-muted-foreground  ">


                    {/* progress bar */}
                    <div className="relative flex justify-start w-full h-[4px] rounded-full bg-white ">
                        <div className="absolute top-0 left-0 w-full h-full rounded-full bg-blue-500 " style={{ width: `${passedPercentage}%` }} />
                        <div className="absolute top-0 left-0 w-full h-full rounded-full bg-green-500 " style={{ width: `${progressPercentage}%` }} />
                        <span
                            className="w-[22px] h-[22px] text-[11px] border border-green-500 text-black flex justify-center items-center rounded-full p-1 bg-white absolute top-[50%] "
                            style={{ transform: `translate(-50%,-50%)`, left: `${progressPercentage}%` }}
                        >
                            {progressPercentage}
                        </span>
                    </div>

                    {/* Badge */}
                    <div className="w-full flex justify-center">
                        <Badge variant="outline" className="w-fit" >
                            {goal.type}
                        </Badge>
                        {/* <GoalDropdown goalId={goal.id} /> */}
                    </div>

                    {/* Title */}
                    <CardTitle className="text-white w-full text-center capitalize hover:opacity-80 " >
                        <Link href={`/goal/view/${goal.id}`} >{goal.goal}</Link>
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <CardDescription className="text-xs text-center">
                        {goal.description.length > 450
                            ? `${goal.description.substring(0, 450)}...`
                            : goal.description
                        }
                    </CardDescription>
                </CardContent>
            </div>

            <CardFooter className="flex-col items-center justify-between gap-2 text-center text-xs text-muted-foreground">
                <p className="">{format(goal.start, "PPP")} - {format(goal.deadline, "PPP")}</p>
                <p className="">{
                    daysLeft < 0
                        ? <span className="text-red-500" >Deadline Exceeded</span>
                        : `${daysLeft > 31 ? monthsLeft + ' months' : daysLeft + ' days'}  to deadline`
                }</p>
            </CardFooter>
        </Card>
    )
}

export default GoalCard