"use client"

import { SearchInput } from '@/components/search-input'
import { MountedContainer } from '@/components/ui/mounted-container'
import React from 'react'
import DiaryGraph from '../diary/components/diary-graph'
import { Diary, Goal, Note, Quote } from '@prisma/client'
import GoalCard from '../goal/components/goal-card'
import { PopulatedDiary, PopulatedGoal } from '@/interfaces'
import { Card, CardContent, CardDescription } from '@/components/ui/card'
import { Plus, Quote as QuoteIcon} from 'lucide-react'
import { Button } from '@/components/ui/button'
import DiaryCard from '../diary/components/diary-card'
import NoteCard from '../note/components/note-card'
import { useNoteModal } from '@/hooks/use-note'
import { useDiaryModal } from '@/hooks/use-diary'
import { useRouter } from 'next/navigation'

const HomeClient = ({ diaries, quote, goals, notes }: { diaries: Diary[], quote: Quote, goals: Goal[], notes: Note[] }) => {

  const router = useRouter()
  const noteModal = useNoteModal()
  const diaryModal = useDiaryModal()

  const onClick = (page: 'note' | 'diary' | 'goal') => {
    if (page == 'note') {
      noteModal.setNote(null) // for create, initialData should be empty
      noteModal.onFormOpen()
    } else if (page == 'diary') {
      diaryModal.setDiary(null)
      diaryModal.onFormOpen()
    } else if (page == 'goal') {
      router.push(`/goal/form/new`)
    }
  }

  return (
    <MountedContainer>
      <div className="space-y-8 transition-all py-4 grid grid-cols-5 w-full">

        {/* Stats */}
        <div className={`h-full p-4 space-y-4 col-span-5 `}>
          <div className="w-full bg-primary/10 p-2 rounded-xl px-4 flex flex-col items-center ">
            <QuoteIcon className='w-6 h-6 ' />
            <h3 className='text-white text-center text-lg font-medium' >{quote.quote}</h3>
            <h3 className='text-sm text-primary/60 text-center ' >{quote.author}</h3>
          </div>
          <div className=" ">
            <DiaryGraph diaries={diaries} />
          </div>
          <div className={`space-y-4 w-full`}>
            <SearchInput />
          </div>
          {/* Goals */}
          <div className="space-y-4 ">
            <h2 className='text-white font-semibold text-3xl ' >Goals</h2>
            <div className="grid grid-cols-3 gap-4">
              {/* Create Goal Card */}
              <Card onClick={() => onClick('goal')} className="min-h-[18rem] bg-primary/10 hover:bg-primary/25 cursor-pointer rounded-xl border-0 transition flex flex-col justify-between ">
                <CardContent className='flex flex-col items-center justify-center w-full h-full ' >
                  <Plus className='w-24 h-24' />
                  Create Goal
                </CardContent>
              </Card>
              {
                goals?.slice(0, 2).map((goal, index) => (
                  <GoalCard goal={goal as PopulatedGoal} key={index} />
                ))
              }
            </div>
            <Button onClick={() => router.push('/goal')} size='sm' className='w-full' >View All</Button>
          </div>
          {/* Diaries */}
          <div className="space-y-4 ">
            <h2 className='text-white font-semibold text-3xl ' >Diaries</h2>
            <div className="grid grid-cols-3 gap-4">
              {/* Create Diary Card */}
              <Card onClick={() => onClick('diary')} className="min-h-[18rem] bg-primary/10 hover:bg-primary/25 cursor-pointer rounded-xl border-0 transition flex flex-col justify-between ">
                <CardContent className='flex flex-col items-center justify-center w-full h-full ' >
                  <Plus className='w-24 h-24' />
                  Create Diary
                </CardContent>
              </Card>
              {
                diaries?.slice(0, 2).map((diary, index) => (
                  <DiaryCard diary={diary as PopulatedDiary} key={index} />
                ))
              }
            </div>
            <Button onClick={() => router.push('/diary')} size='sm' className='w-full' >View All</Button>
          </div>

          {/* Notes */}
          <div className="space-y-4 ">
            <h2 className='text-white font-semibold text-3xl ' >Notes</h2>
            <div className="grid grid-cols-3 gap-4">
              {/* Create Note Card */}
              <Card onClick={() => onClick('note')} className="min-h-[18rem] bg-primary/10 hover:bg-primary/25 cursor-pointer rounded-xl border-0 transition flex flex-col justify-between ">
                <CardContent className='flex flex-col items-center justify-center w-full h-full ' >
                  <Plus className='w-24 h-24' />
                  Create Note
                </CardContent>
              </Card>
              {
                notes?.slice(0, 2).map((note, index) => (
                  <NoteCard note={note} key={index} />
                ))
              }
            </div>
            <Button onClick={() => router.push('/note')} size='sm' className='w-full' >View All</Button>
          </div>
        </div>

      </div>
    </MountedContainer>
  )
}

export default HomeClient