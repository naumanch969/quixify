"use client"

import React, { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { MountedContainer } from '@/components/ui/mounted-container'
import { progressColors } from '@/lib/utils'
import { Diary, } from '@prisma/client'
import { useUser } from '@clerk/nextjs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CustomPagination } from '@/components/pagination'

const HomeGraph = ({ diaries }: { diaries: Diary[] }) => {


    const { user } = useUser();

    const legendPayload = [
        { value: `Excellent`, color: progressColors[100] },
        { value: `Good`, color: progressColors[80] },
        { value: `Normal`, color: progressColors[60] },
        { value: `Bad`, color: progressColors[40] },
        { value: `Critical`, color: progressColors[20] },
        { value: `No Progress`, color: '#FFFFFF' },
    ]

    const [data, setData] = useState<{ variant: string, productivity: number, 20: number, 40: number, 60: number, 80: number, 100: number, today: number }[]>([])
    const [splitLength, setSplitLength] = useState<string | number>(7)
    const [splitNumber, setSplitNumber] = useState<string | number>(1)
    const [maxSplitNumber, setMaxSplitNumber] = useState(1)

    useEffect(() => {

    }, [user, splitLength, splitNumber, diaries])

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
            <div className="w-full overflow-x-auto space-x-2 p-1 h-[26rem] overflow-hidden">
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
        </MountedContainer>
    )
}

export default HomeGraph