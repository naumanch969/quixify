"use client"

import React, { useEffect } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { useProgressModal } from '@/hooks/use-progress'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Textarea } from '../ui/textarea'
import { Input } from '../ui/input'
import { Wand2 } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
const formSchema = z.object({
    workDone: z.string().min(1, { message: 'Goal is required.' }),
    percentage: z.string().min(1, { message: 'Percentage is required.' }),
});
const ProgressModal = () => {

    // <---------------------------------------- VARIABLES ------------------------------------------>
    const router = useRouter()
    const progressModal = useProgressModal()
    const goal = progressModal.goal!
    const type = goal?.type == 'daily' ? 'day' : goal?.type?.slice(0, -2)
    const initialValues = { workDone: '', percentage: '0', }
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialValues,
    });
    const loading = form.formState.isSubmitting;

    // <---------------------------------------- USE EFFECT ------------------------------------------>
    useEffect(() => {
        if (progressModal.isOpen) {
            form.reset({
                ...(progressModal.progress
                    ? { ...progressModal.progress, percentage: String(progressModal.progress?.percentage) } :
                    initialValues
                )
            });
        }
    }, [progressModal.isOpen, progressModal.progress, form]);

    // <---------------------------------------- FUNCTIONS ------------------------------------------>
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            // UPDATE
            if (progressModal.progress) {
                await axios.patch(`/api/goal/${goal?.id}/progress/${progressModal.progress.id}`, { ...values, percentage: parseFloat(values.percentage) });
            }
            // CREATE
            else {
                await axios.post(`/api/goal/${goal?.id}/progress`, { ...values, percentage: parseFloat(values.percentage) });
            }
            toast.success("Success.")
            router.refresh();
            progressModal.onClose()
        } catch (error: any) {
            toast.error(error?.response?.data || 'Something went wrong!');
        }
    };

    return (
        <Modal
            title='Progress'
            description={`Your progress of the ${type}`}
            isOpen={progressModal.isOpen}
            onClose={() => { progressModal.onClose() }}
        >
            <div className="h-full p-4 space-y-2 max-w-3xl mx-auto ">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8 "
                    >
                        <div className="space-y-4">
                            <FormField
                                name="workDone"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className="col-span-2 md:col-span-1 ">
                                        <FormLabel>
                                            Work Done
                                            <span className="text-red-500">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                disabled={loading}
                                                placeholder="Work Done"
                                                className="resize-none"
                                                rows={8}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            What you have done this {type}?
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="percentage"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className="col-span-2 md:col-span-1 ">
                                        <FormLabel>
                                            Percentage
                                            <span className="text-red-500">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={loading}
                                                type='number'
                                                min={0}
                                                max={100}
                                                placeholder="Percentage"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            How much you completed your task this {type}?
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="w-full flex justify-center ">
                            <Button size="lg" disabled={loading}>
                                {progressModal.progress
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

export default ProgressModal