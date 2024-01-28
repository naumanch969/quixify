"use client"

import { getProgressStat, } from '@/actions/goals/get-progress'
import { PopulatedGoal } from '@/interfaces'
import React, { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MountedContainer } from '@/components/ui/mounted-container'
import { progressColors } from '@/lib/utils'
import { CustomPagination } from '@/components/pagination'
import { Progress } from '@prisma/client'
import { getPassedDurationPercentage } from '../../../components/utils'

const Graphs = ({ goal }: { goal: PopulatedGoal }) => {


  const type = goal.type == 'daily' ? 'day' : goal.type.slice(0, -2)
  const { passedPercentage, remainedPercentage } = getPassedDurationPercentage(goal)
  const goalProgress = goal?.progress?.reduce((total: number, item: Progress) => {
    return total + (item.percentage / 100);
  }, 0);
  const lag = parseFloat((passedPercentage - goalProgress).toFixed(2));

  const legendPayload = [
    { value: `${goalProgress}% Completed`, color: progressColors[100] },
    { value: `${lag}% Lagging`, color: progressColors[20] },
    { value: `${remainedPercentage}% Remained`, color: progressColors['disabled'] },
  ]

  const [data, setData] = useState<{ variant: string, progress: number, 20: number, 40: number, 60: number, 80: number, 100: number, today: number }[]>([])
  const [splitLength, setSplitLength] = useState<string | number>(7)
  const [splitNumber, setSplitNumber] = useState<string | number>(0)
  const [maxSplitNumber, setMaxSplitNumber] = useState(1)

  useEffect(() => {
    setData(getProgressStat(goal, Number(splitNumber), Number(splitLength), setSplitNumber))
    setMaxSplitNumber(Math.ceil(goal.progress.length / Number(splitLength)))
  }, [splitLength, splitNumber, goal.progress])

  const onForward = () => {
    if (splitNumber != maxSplitNumber)
      setSplitNumber(pre => Number(pre) + 1)
  }
  const onBack = () => {
    if (splitNumber != 1)
      setSplitNumber(pre => Number(pre) - 1)
  }

  return (
    <MountedContainer>
      <div className="w-full overflow-x-auto space-x-2 p-1 aspect-[3.5/1] overflow-hidden ">
        <div className="w-full h-full grid grid-cols-7 gap-x-4 ">
          <div className="col-span-5 bg-card relative flex flex-col gap-2  ">
            <div className="flex justify-between items-center bg-black rounded-lg p-2 pl-8 ">
              <h3 className='font-semibold text-3xl ' >Progress</h3>
              <div className="flex items-center gap-x-4">
                <Select onValueChange={(value) => setSplitLength(value)} >
                  <SelectTrigger className="w-[180px] bg-muted">
                    <SelectValue placeholder="Split Length" />
                  </SelectTrigger>
                  <SelectContent>
                    {
                      Array(9).fill("").map((_, index) => (
                        <SelectItem key={index} value={String(index + 4)}>{index + 4}</SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
                <CustomPagination onForward={onForward} onBack={onBack} />
              </div>
            </div>
            <div className='w-full h-full relative rounded-lg ' >
              <ResponsiveContainer width='100%'  >
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="variant" />
                  <YAxis max={100} min={0} />
                  <Legend payload={legendPayload} />
                  <Bar dataKey="20" stackId="same" fill={progressColors[20]} />
                  <Bar dataKey="40" stackId="same" fill={progressColors[40]} />
                  <Bar dataKey="60" stackId="same" fill={progressColors[60]} />
                  <Bar dataKey="80" stackId="same" fill={progressColors[80]} />
                  <Bar dataKey="100" stackId="same" fill={progressColors[100]} />
                  <Bar dataKey="today" stackId="same" fill={"#FFFFFF"} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="col-span-2 bg-card rounded-lg p-2 space-y-2 text-center h-full overflow-auto ">
            <h4 className='font-medium' >Task per {type}</h4>
            <p className='text-sm text-muted-foreground' >{goal?.purpose} {goal?.purpose}</p>
          </div>
        </div>
      </div>
    </MountedContainer>
  )
}

export default Graphs