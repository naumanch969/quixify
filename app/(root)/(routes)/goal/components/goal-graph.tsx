"use client"

import { getProgressStat, } from '@/actions/goals/get-progress'
import { PopulatedGoal } from '@/interfaces'
import React, { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { MountedContainer } from '@/components/ui/mounted-container'
import { progressColors } from '@/lib/utils'
import { Progress } from '@prisma/client'
import { getMainGraphData, getPassedDurationPercentage } from './utils'
import { useUser } from '@clerk/nextjs'
import { format } from 'date-fns'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CustomPagination } from '@/components/pagination'

const GoalGraph = ({ goals }: { goal: PopulatedGoal, goals: PopulatedGoal[] }) => {


  const { user } = useUser();

  const legendPayload = [
    { value: `Excellent`, color: progressColors[100] },
    { value: `Good`, color: progressColors[80] },
    { value: `Normal`, color: progressColors[60] },
    { value: `Bad`, color: progressColors[40] },
    { value: `Critical`, color: progressColors[20] },
    { value: `No Progress`, color: '#FFFFFF' },
  ]

  const [data, setData] = useState<{ variant: string, progress: number, 20: number, 40: number, 60: number, 80: number, 100: number, today: number }[]>([])
  const [splitLength, setSplitLength] = useState<string | number>(7)
  const [splitNumber, setSplitNumber] = useState<string | number>(1)
  const [maxSplitNumber, setMaxSplitNumber] = useState(1)

  useEffect(() => {
    if (user?.createdAt) {
      const d = getMainGraphData(goals, user.createdAt as Date)
      setData(d)
      setMaxSplitNumber(Math.ceil(d.length / Number(splitLength)))
    }
  }, [user, splitLength, splitNumber, goals])

  const onForward = () => {
    if (splitNumber != maxSplitNumber)
      setSplitNumber(pre => Number(pre) + 1)
  }
  const onBack = () => {
    if (splitNumber != 1)
      setSplitNumber(pre => Number(pre) - 1)
  }
  console.log(maxSplitNumber, splitNumber)
  return (
    <MountedContainer>
      <div className="w-full overflow-x-auto space-x-2 p-1 h-[26rem] overflow-hidden ">
        <div className="w-full h-full flex flex-col gap-4 ">
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
              <CustomPagination onForward={onForward} onBack={onBack} forwardDisabled={splitNumber == maxSplitNumber} backDisabled={splitNumber == 1} />
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
      </div>
    </MountedContainer>
  )
}

export default GoalGraph