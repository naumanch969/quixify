"use client"

import { Diaries } from '@/app/(root)/(routes)/diary/components/diaries'
import { DiaryGraph } from '@/app/(root)/(routes)/diary/components/diary-graph'
import { SearchInput } from '@/components/search-input'
import { MountedContainer } from '@/components/ui/mounted-container'
import { useDiaryModal } from '@/hooks/use-diary'
import { Diary } from '@prisma/client'
import React from 'react'
import { DiaryForm } from './diary-form'

const DiaryClient = ({ diaries }: { diaries: Diary[] }) => {

  const { isOpen } = useDiaryModal()

  return (
    <MountedContainer>
      <div className="grid grid-cols-5 transition-all ">

        <div className={`h-full p-4 space-y-4 ${isOpen ? 'col-span-3' : 'col-span-5'} `}>
          <SearchInput />
          <DiaryGraph data={[]} />
          <Diaries data={diaries} />
        </div>

        {
          isOpen &&
          <div className="col-span-2">
            <DiaryForm />
          </div>
        }

      </div>
    </MountedContainer>
  )
}

export default DiaryClient