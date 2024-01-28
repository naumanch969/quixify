import prismadb from '@/lib/prismadb'
import { auth } from '@clerk/nextjs'
import React from 'react'
import toast from 'react-hot-toast'
import Graphs from './components/graphs'
import RelatedDiaries from './components/related-diaries'
import DiaryDetail from './components/diary-detail'
import { Diary, Progress } from '@prisma/client'

const DiaryPage = async ({ params: { diaryId } }: { params: { diaryId: string } }) => {

  const { userId } = auth()
  if (!userId) return toast.error('Please login first.')

  if (!diaryId) return

  const diary = await prismadb.diary.findFirst({
    where: { id: diaryId, userId },
    include: {
      tagItems: {
        include: { tag: true }
      }
    }
  })


  return (
    <div className='p-4 space-y-8 h-full' >

      <div className="space-y-4 ">
        <DiaryDetail diary={diary as Diary} />
      </div>

      <RelatedDiaries />

    </div>
  )
}

export default DiaryPage