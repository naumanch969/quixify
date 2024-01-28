import { Diaries } from '@/app/(root)/(routes)/diary/components/diaries'
import { Heading } from '@/components/ui/heading'
import prismadb from '@/lib/prismadb'
import { auth } from '@clerk/nextjs'
import React from 'react'
import toast from 'react-hot-toast'

const RelatedDiaries = async () => {

  const { userId } = auth()
  if (!userId) return toast.error('Please Login First.')

  const diaries = await prismadb.diary.findMany({
    where: { userId }
  })

  return (
    <div className='' >

      <Heading title='Related Diaries' description='' />
      <Diaries data={diaries} />

    </div>
  )
}

export default RelatedDiaries