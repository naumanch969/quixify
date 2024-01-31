"use client"

import React, { useEffect } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Textarea } from '../ui/textarea'
import { Wand2 } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { useQuoteModal } from '@/hooks/use-quote'
import { Input } from '../ui/input'
const formSchema = z.object({
    quote: z.string().min(1, { message: 'Quote is required.' }),
    author: z.string().min(1, { message: 'Author is required.' }),
    isFeatured: z.boolean(),
    book: z.string()
});
const QuoteFormModal = () => {

    // <---------------------------------------- VARIABLES ------------------------------------------>
    const router = useRouter()
    const { formOpen, onFormClose, quote } = useQuoteModal()
    const initialValues = { quote: '', author: '', book: '', isFeatured: false }
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialValues,
    });
    const loading = form.formState.isSubmitting;

    // <---------------------------------------- USE EFFECT ------------------------------------------>
    useEffect(() => {
        if (formOpen) {
            form.reset({ ...(quote ? { ...quote, book: quote.book ? quote.book : '' } : initialValues) });
        }
    }, [formOpen, quote, form]);

    // <---------------------------------------- FUNCTION ------------------------------------------>
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            if (quote) {
                await axios.patch(`/api/quote/${quote?.id}`, values);
            }
            else {
                await axios.post(`/api/quote`, values);
            }
            toast.success("Success.")
            router.refresh();
            form.reset(initialValues);
            onFormClose()
        } catch (error: any) {
            toast.error(error?.response?.data || 'Something went wrong!');
        }
    };

    return (
        <Modal
            title='Quote'
            description=''
            isOpen={formOpen}
            onClose={onFormClose}
        >
            <div className="h-full p-4 space-y-2 max-w-3xl mx-auto ">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8 "
                    >
                        <div className="space-y-4">
                            <FormField
                                name="quote"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className="col-span-2 md:col-span-1 ">
                                        <FormLabel>
                                            Quote
                                            <span className="text-red-500">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                disabled={loading}
                                                placeholder="Title"
                                                className="resize-none"
                                                rows={2}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="author"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className="col-span-2 md:col-span-1 ">
                                        <FormLabel>
                                            Author
                                            <span className="text-red-500">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={loading}
                                                placeholder="Description"
                                                className="resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="book"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className="col-span-2 md:col-span-1 ">
                                        <FormLabel>
                                            Book (Optional)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={loading}
                                                placeholder="Book"
                                                className="resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* isFeatured */}
                            <FormField
                                control={form.control}
                                name="isFeatured"
                                render={({ field }) => (
                                    <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4' >
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                // ts-ignore
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>Featured</FormLabel>
                                            <FormDescription>This quote will fixed on the home page</FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="w-full flex justify-center ">
                            <Button size="lg" disabled={loading}>
                                {quote
                                    ? "Save changes"
                                    : "Create"}
                                <Wand2 className="w-4 h-4 ml-2 " />
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </Modal>
    )
}

export default QuoteFormModal