import { Goals } from '@/app/(root)/(routes)/goal/components/goals'
import { Heading } from '@/components/ui/heading'
import prismadb from '@/lib/prismadb'
import { auth } from '@clerk/nextjs'
import React from 'react'
import toast from 'react-hot-toast'

const RelatedGoals = async () => {

  const { userId } = auth()
  if (!userId) return toast.error('Please Login First.')

  const goals = await prismadb.goal.findMany({
    where: { userId }
  })

  return (
    <div className='' >

      <Heading title='Related Goals' description='' />
      <Goals data={goals} />

    </div>
  )
}

export default RelatedGoals