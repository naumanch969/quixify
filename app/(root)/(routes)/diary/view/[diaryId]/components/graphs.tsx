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

const Graphs = ({ goal }: { goal: PopulatedGoal }) => {
  const MONTHS = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];

  const type = goal.type == 'daily' ? 'day' : goal.type.slice(0, -2)

  const [data, setData] = useState<{ variant: string, progress: number }[]>([])
  const [splitLength, setSplitLength] = useState<string | number>(7)
  const [splitNumber, setSplitNumber] = useState<string | number>(1)
  const [maxSplitNumber, setMaxSplitNumber] = useState(1)

  useEffect(() => {
    setData(getProgressStat(goal, Number(splitNumber), Number(splitLength)))
    setMaxSplitNumber(Math.ceil(goal.progress.length / Number(splitLength)))
  }, [splitLength, splitNumber])


  return (
    <MountedContainer>
      <div className="w-full overflow-x-auto space-x-2 p-1 aspect-[3.5/1] overflow-hidden ">
        <div className="w-full h-full grid grid-cols-7 gap-x-4 ">
          <div className="col-span-5 bg-card rounded-lg relative ">
            <div className="absolute top-2 right-2 flex gap-x-2 z-[40] ">
              <Select onValueChange={(value) => setSplitLength(value)} >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Split Length" />
                </SelectTrigger>
                <SelectContent>
                  {
                    Array(25).fill("").map((_, index) => (
                      <SelectItem key={index} value={String(index + 5)}>{index + 5}</SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
              <Select onValueChange={(value) => setSplitNumber(value)} >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Split Number" />
                </SelectTrigger>
                <SelectContent>
                  {
                    Array(maxSplitNumber).fill("").map((_, index) => (
                      <SelectItem key={index} value={String(index + 1)}>{index + 1}</SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
            <ResponsiveContainer width='100%' height="100%" >
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="variant" />
                <YAxis color='#eeeeee' />
                <Tooltip />
                <Legend />
                <Bar dataKey="progress" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
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