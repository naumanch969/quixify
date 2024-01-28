import { Notes } from './notes'
import { SearchInput } from '@/components/search-input'
import { Note } from '@prisma/client'
import React from 'react'

const NoteClient = ({ notes }: { notes: Note[] }) => {
  return (
    <div className="h-full p-4 space-y-4">
      <SearchInput />
      <Notes data={notes} />
    </div>
  )
}

export default NoteClient