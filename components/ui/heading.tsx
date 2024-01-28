import React from 'react'

type Props = {
    title: string,
    description: string
}

export const Heading = ({ title, description }: Props) => {
    return (
        <div className='space-y-1' >
            <h2 className='text-3xl font-bold tracking-normal ' >{title}</h2>
            <p className='text-sm text-muted-foreground' >{description}</p>
        </div>
    )
}