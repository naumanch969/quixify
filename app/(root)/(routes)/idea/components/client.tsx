import { SearchInput } from '@/components/search-input'
import { Idea } from '@prisma/client'
import React from 'react'
import { Ideas } from './ideas'

const IdeaClient = ({ ideas }: { ideas: Idea[] }) => {
    return (
        <div className="h-full p-4 space-y-4">
            <SearchInput />
            <Ideas data={ideas} />
        </div>
    )
}

export default IdeaClient