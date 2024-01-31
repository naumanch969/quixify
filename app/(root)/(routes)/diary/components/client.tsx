"use client"

import { Diaries } from '@/app/(root)/(routes)/diary/components/diaries'
import { SearchInput } from '@/components/search-input'
import { MountedContainer } from '@/components/ui/mounted-container'
import { Diary } from '@prisma/client'
import React from 'react'
import DiaryGraph from './diary-graph'

const DiaryClient = ({ diaries }: { diaries: Diary[] }) => {


  return (
    <MountedContainer>
      <div className="grid grid-cols-5 transition-all ">

        <div className={`h-full p-4 space-y-4 col-span-5`}>
          <SearchInput />
          <DiaryGraph diaries={diaries} />
          <Diaries data={diaries} />
        </div>


      </div>
    </MountedContainer>
  )
}

export default DiaryClient