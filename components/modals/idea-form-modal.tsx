"use client"

import React, { useEffect } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Textarea } from '../ui/textarea'
import { Wand2 } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { useIdeaModal } from '@/hooks/use-idea'
const formSchema = z.object({
    title: z.string().min(1, { message: 'Title is required.' }),
    description: z.string().min(1, { message: 'Description is required.' }),
});
const IdeaFormModal = () => {

    // <---------------------------------------- VARIABLES ------------------------------------------>
    const router = useRouter()
    const { formOpen, onFormClose, idea } = useIdeaModal()
    const initialValues = { title: '', description: '', }
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialValues,
    });
    const loading = form.formState.isSubmitting;

    // <---------------------------------------- USE EFFECT ------------------------------------------>
    useEffect(() => {
        if (formOpen) {
            form.reset({ ...(idea ? idea : initialValues) });
        }
    }, [formOpen, idea, form]);

    // <---------------------------------------- FUNCTIONS ------------------------------------------>
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            if (idea) {
                await axios.patch(`/api/idea/${idea?.id}`, values);
            }
            else {
                await axios.post(`/api/idea`, values);
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
            title='Idea'
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
                                name="title"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className="col-span-2 md:col-span-1 ">
                                        <FormLabel>
                                            Title
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
                                name="description"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className="col-span-2 md:col-span-1 ">
                                        <FormLabel>
                                            Description
                                            <span className="text-red-500">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                disabled={loading}
                                                placeholder="Description"
                                                className="resize-none"
                                                rows={5}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="w-full flex justify-center ">
                            <Button size="lg" disabled={loading}>
                                {idea
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

export default IdeaFormModal