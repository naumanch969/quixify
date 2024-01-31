import { SearchInput } from '@/components/search-input'
import { Quote } from '@prisma/client'
import React from 'react'
import { Quotes } from './quotes'

const QuoteClient = ({ quotes }: { quotes: Quote[] }) => {
    return (
        <div className="h-full p-4 space-y-4">
            <SearchInput />
            <Quotes data={quotes} />
        </div>
    )
}

export default QuoteClient