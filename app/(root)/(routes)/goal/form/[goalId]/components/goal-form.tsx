"use client";

import * as z from "zod";
import React from "react";
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
import { CalendarIcon, Wand2 } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format, isAfter } from "date-fns";
import toast from "react-hot-toast";
import { MountedContainer } from "@/components/ui/mounted-container";

type Props = {
  initialData?: any | null; // Goal
};

const formSchema = z.object({
  goal: z.string().min(1, { message: 'Goal is required.' }),
  description: z.string().min(1, { message: 'Description is required.' }),
  start: z.date({ required_error: "Start date is required.", }),
  deadline: z.date({ required_error: "Deadline is required.", }),
  type: z.string().min(1, { message: 'Type is required.' }),
  purpose: z.string().min(1, { message: 'Purpose is required.' }),
  impact: z.string().min(1, { message: 'Impact is required.' }),
  unitTask: z.string().min(1, { message: 'TaskPerDay is required.' }),
});

export const GoalForm = (props: Props) => {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: props.initialData || {
      goal: '',
      description: '',
      purpose: '',
      impact: '',
      start: '',
      deadline: '',
      type: 'daily',
      unitTask: '',
    },
  });

  const loading = form.formState.isSubmitting;

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {

      if (isAfter(values.start, values.deadline)) {
        const errorMessage = `Error: Start date ${format(values.start, "P")} is greater than the deadline ${format(values.deadline, "P")}`;
        return toast.error(errorMessage)
      }

      // UPDATE
      if (props.initialData) {
        await axios.patch(`/api/goal/${props.initialData.id}`, values);
      }
      // CREATE
      else {
        await axios.post("/api/goal", values);
      }
      toast.success("Success.")
      router.refresh();
      router.push("/goal");
    } catch (error: any) {
      toast.error(error?.response?.data || 'Something went wrong!');
    }
  };

  return (
    <MountedContainer>
      <div className="h-full p-4 space-y-2 max-w-3xl mx-auto ">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 pb-10 "
          >
            <div className="space-y-2 w-full">
              <div className="">
                <h3 className="text-lg font-medium">General Information</h3>
                <p className="text-sm text-muted-foreground ">
                  General information about your Goal
                </p>
              </div>
              <Separator className="bg-primary/10" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
              <FormField
                name="goal"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="col-span-2 md:col-span-1 ">
                    <FormLabel>
                      Goal
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormDescription>
                      What you want to achieve?
                    </FormDescription>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Goal"
                        {...field}
                      />
                    </FormControl>
                    {/* To display error messages */}
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
                    <FormDescription>
                      Short description of your goal.
                    </FormDescription>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Description"
                        {...field}
                      />
                    </FormControl>
                    {/* To display error messages */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="purpose"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="col-span-2 md:col-span-1 ">
                    <FormDescription>
                      Why do you wanna achieve this goal?
                    </FormDescription>
                    <FormLabel>
                      Purpose
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={loading}
                        placeholder="Purpose"
                        className="resize-none"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="impact"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="col-span-2 md:col-span-1 ">
                    <FormLabel>
                      Impact
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormDescription>
                      What impact it will have if you achieve it?
                    </FormDescription>
                    <FormControl>
                      <Textarea
                        disabled={loading}
                        placeholder="Impact"
                        className="resize-none"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="unitTask"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="col-span-2 md:col-span-1 ">
                    <FormLabel>
                      Task per
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormDescription>
                      What impact it will have if you achieve it?
                    </FormDescription>
                    <FormControl>
                      <Textarea
                        disabled={loading}
                        placeholder="Task Per Day"
                        className="resize-none"
                        rows={4}
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
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormDescription>
                      Select the type of your goal.
                    </FormDescription>
                    <Select
                      disabled={loading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
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
                        <SelectItem value='daily'>Daily</SelectItem>
                        <SelectItem value='weekly'>Weekly</SelectItem>
                        <SelectItem value='monthly'>Monthly</SelectItem>
                        <SelectItem value='yearly'>Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="start"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start</FormLabel>
                    <FormDescription>
                      The date of starting to work to achieve your goal.
                    </FormDescription>
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
                          disabled={(date) =>
                            date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Deadline</FormLabel>
                    <FormDescription>
                      The deadline to achieve your goal.
                    </FormDescription>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal hover:bg-background",
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
                          disabled={(date) =>
                            date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="w-full flex justify-center ">
              <Button size="lg" disabled={loading}>
                {props.initialData
                  ? "Save changes"
                  : "Create"}
                <Wand2 className="w-4 h-4 ml-2 " />
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </MountedContainer>
  );
};
