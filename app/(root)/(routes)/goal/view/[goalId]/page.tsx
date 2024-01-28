import prismadb from '@/lib/prismadb'
import { auth } from '@clerk/nextjs'
import React from 'react'
import toast from 'react-hot-toast'
import Graphs from './components/graphs'
import RelatedGoals from './components/related-goals'
import GoalDetail from './components/goal-detail'
import { Goal, Progress } from '@prisma/client'
import GoalAccordian from './components/goal-accordian'
import { PopulatedGoal } from '@/interfaces'

const GoalPage = async ({ params: { goalId } }: { params: { goalId: string } }) => {

  
  const { userId } = auth()
  if (!userId) return toast.error('Please login first.')

  if (!goalId) return

  const goal = await prismadb.goal.findFirst({
    where: { id: goalId, userId },
    include: { progress: true }
  })

 
  return (
    <div className='p-4 space-y-8 h-full' >

      <div className="space-y-4 ">
        <Graphs goal={goal as PopulatedGoal} />
        <div className="grid grid-cols-2 gap-x-4 ">
          <GoalDetail goal={goal as Goal} />
          <GoalAccordian goal={goal as PopulatedGoal} />
        </div>
      </div>

      <RelatedGoals />

    </div>
  )
}

export default GoalPage