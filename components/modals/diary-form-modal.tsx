"use client";

import * as z from "zod";
import React, { useEffect, useState } from "react";
// import { zodResolver } from "@hookform/resolvers";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { ImageUpload } from "@/components/image-upload";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod"
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Wand2, X } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format, isAfter } from "date-fns";
import toast from "react-hot-toast";
import { MountedContainer } from "@/components/ui/mounted-container";
import { useDiaryModal } from "@/hooks/use-diary";
import { Badge } from "@/components/ui/badge";
import { PopulatedDiary } from "@/interfaces";
import { Modal } from "../ui/modal";


const formSchema = z.object({
    productivity: z.string().min(1, { message: 'Diary is required.' }),
    description: z.string(),
    main: z.array(z.string({ required_error: "Start date is required." })),
    day: z.date({ required_error: "Deadline is required." }),
    tags: z.array(z.string().min(1, { message: 'Type is required.' })),
    type: z.string().min(1, { message: 'Type is required.' }),
});


const DiaryFormModal = () => {

    // <---------------------------------------- STATES ------------------------------------------>
    const { diary, formOpen, onFormClose, } = useDiaryModal()
    const [main, setMain] = useState('')
    const [tag, setTag] = useState('')

    // <---------------------------------------- VARIABLES ------------------------------------------>
    const initialValues = {
        productivity: '0',
        description: '',
        main: [],
        day: new Date(),
        tags: [],
        type: '',
    }
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialValues,
    });
    const isLoading = form.formState.isSubmitting;

    // <---------------------------------------- USE EFFECT ------------------------------------------>
    useEffect(() => {
        if (formOpen) {
            form.reset({
                ...(
                    diary
                        ? { ...diary, description: diary?.description ?? '', productivity: String(diary?.productivity), tags: (diary as PopulatedDiary)?.tagItems?.map(ti => ti?.tag?.text) }
                        : initialValues
                )
            });
        }
    }, [formOpen, diary, form]);

    // <---------------------------------------- FUNCTIONS ------------------------------------------>
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {

            let formMain = values.main
            if (main) formMain = [...formMain, main]
            let formTags = values.tags
            if (tag) formTags = [...formTags, tag]

            if (diary) {
                await axios.patch(`/api/diary/${diary.id}`, { ...values, productivity: parseFloat(values.productivity), tags: formTags, main: formMain });
            }
            else {
                await axios.post("/api/diary", { ...values, productivity: parseFloat(values.productivity), tags: formTags, main: formMain });
            }
            toast.success("Success.")
            onFormClose()
            form.reset(initialValues);
            setMain('')
            setTag('')
            router.refresh();
            router.push("/diary");
        } catch (error: any) {
            toast.error(error?.response?.data || 'Something went wrong!');
        }
    };

    const handleAddEvent = (e: React.KeyboardEvent<HTMLInputElement>, field: { value: string[], onChange: (value: string[]) => void }, type: 'main' | 'tag') => {
        if (e.key === 'Enter' && e.currentTarget.value.trim() !== '') {
            type == 'main' ? setMain('') : setTag('')
            e.preventDefault();
            field.value
                ?
                field.onChange([...field?.value, e.currentTarget.value])
                :
                field.onChange([e.currentTarget.value]);
        }
    };
    const handleFilter = (text: string, field: { value: string[], onChange: (value: string[]) => void }) => {
        const updatedMain = field.value.filter(item => item !== text);
        field.onChange(updatedMain);
    };


    return (
        <Modal
            title='Diary'
            description=''
            isOpen={formOpen}
            onClose={onFormClose}
        >
            <MountedContainer>
                <div className="w-full h-full p-4 space-y-2 max-w-3xl mx-auto overflow-y-auto ">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8 pb-10 "
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ">
                                <FormField
                                    control={form.control}
                                    name="day"
                                    render={({ field }) => (
                                        <FormItem className="col-span-1 md:col-span-2 flex flex-col">
                                            <FormLabel>
                                                Date
                                                <span className="text-red-500">*</span>
                                            </FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "pl-3 text-left font-normal hover:bg-background ",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP")
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) => date < new Date("1900-01-01")}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="productivity"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="col-span-1 md:col-span-1 ">
                                            <FormLabel>
                                                Productivity
                                                <span className="text-red-500">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled={isLoading}
                                                    type='number'
                                                    min={0}
                                                    max={100}
                                                    placeholder="Diary"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="type"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="col-span-1 md:col-span-1 " >
                                            <FormLabel>Type</FormLabel>
                                            <Select
                                                disabled={isLoading}
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                defaultValue={"normal"}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="bg-background">
                                                        <SelectValue
                                                            defaultValue={field.value}
                                                            placeholder="Select Type"
                                                        />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value='normal'>Normal</SelectItem>
                                                    <SelectItem value='didSomethingNew'>Did something new</SelectItem>
                                                    <SelectItem value='learntSomethingNew'>Learnt something new</SelectItem>
                                                    <SelectItem value='happy'>Happy</SelectItem>
                                                    <SelectItem value='weatherWasQuiteGood'>Weather was quite good</SelectItem>
                                                    <SelectItem value='weatherWasQuiteIntense'>Weather was quite intense</SelectItem>
                                                    <SelectItem value='achieveATarget'>Achieve a target</SelectItem>
                                                    <SelectItem value='travel'>Travel</SelectItem>
                                                    <SelectItem value='restaurant'>Restaurant</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="main"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="col-span-1 md:col-span-2 ">
                                            <FormLabel>
                                                Main Text
                                                <span className="text-red-500">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <>
                                                    <Input
                                                        placeholder="Text - separated by enter"
                                                        value={main}
                                                        onChange={(e) => setMain(e.target.value)}
                                                        onKeyDown={(e) => { handleAddEvent(e, field, 'main') }}
                                                    />
                                                    <div className="space-x-1">
                                                        {field.value?.map((text: string, index: number) => (
                                                            <Badge key={index}>
                                                                {text}{' '}
                                                                <X onClick={() => handleFilter(text, field)} className="w-4 h-4 rounded-full" />
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="tags"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="col-span-1 md:col-span-2 ">
                                            <FormLabel>Tags</FormLabel>
                                            <FormControl>
                                                <>
                                                    <Input
                                                        placeholder="Tag - separated by enter"
                                                        value={tag}
                                                        onChange={(e) => setTag(e.target.value)}
                                                        onKeyDown={(e) => { handleAddEvent(e, field, 'tag'); }}
                                                    />
                                                    <div className="space-x-1">
                                                        {field.value?.map((text: string, index: number) => (
                                                            <Badge key={index}>
                                                                {text}{' '}
                                                                <X onClick={() => handleFilter(text, field)} className="w-4 h-4 rounded-full" />
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="description"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="col-span-1 md:col-span-2 ">
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    rows={8}
                                                    disabled={isLoading}
                                                    placeholder="Description"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="w-full flex justify-center ">
                                <Button size="lg" disabled={isLoading}>
                                    {diary
                                        ? "Save changes"
                                        : "Create"}
                                    <Wand2 className="w-4 h-4 ml-2 " />
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </MountedContainer>
        </Modal>
    )
}

export default DiaryFormModal