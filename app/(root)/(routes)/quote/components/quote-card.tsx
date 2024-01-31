"use client"

import React, { useState } from 'react'
import { Quote } from '@prisma/client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';
import { useQuoteModal } from '@/hooks/use-quote';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import AlertModal from '@/components/modals/alert-modal';
import { MountedContainer } from '@/components/ui/mounted-container';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const QuoteCard = ({ quote }: { quote: Quote }) => {

  const quoteModal = useQuoteModal()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const onDelete = async () => {
    try {
      setLoading(true)
      await axios.delete(`/api/quote/${quote.id}`)
      router.refresh()
      setOpen(false)
      toast.success('Success!')
    } catch (error: any) {
      toast.error(error?.response?.data || "Something went wrong!")
    } finally {
      setLoading(false)
    }
  }

  const onUpdateClick = () => {
    quoteModal.onFormOpen()
    quoteModal.setQuote(quote)
  }

  return (
    <MountedContainer>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <Card className="min-h-[18rem] bg-primary/10 rounded-xl border-0 transition flex flex-col justify-between " >

        <div className="flex flex-col">
          <CardHeader className="flex flex-col gap-4 justify-center items-center text-muted-foreground  ">
            <CardTitle className="text-white w-full capitalize hover:opacity-80 text-center "  >
              <Link href={`/quote/view/${quote.id}`} className='flex items-center gap-x-2' >{quote.quote}</Link>
            </CardTitle>
          </CardHeader>

          <CardContent>
            <CardDescription className="text-xs text-center">
              {quote.author} {quote.book ? ` - ${quote.book}` : ''}
            </CardDescription>
          </CardContent>

          <CardFooter className='flex justify-end items-center gap-x-2 ' >
            <Button onClick={onUpdateClick} size='icon' variant='secondary' ><Edit /></Button>
            <Button onClick={() => setOpen(true)} size='icon' variant='destructive' ><Trash /></Button>
          </CardFooter>
        </div>
      </Card>
    </MountedContainer>
  )
}

export default QuoteCard