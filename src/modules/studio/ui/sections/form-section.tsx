"use client"
import { Button } from '@/components/ui/button'
import {useForm} from 'react-hook-form'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { trpc } from '@/trpc/client'
import { Loader2, Loader2Icon, MoreVerticalIcon, TrashIcon } from 'lucide-react'
import React, { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import {zodResolver} from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

import { z } from 'zod'
import { videoUpdateSchema } from '@/db/schema'
import { toast } from 'sonner'




interface FormSectionProps {
    videoId: string
}

const FormSection = ({videoId}:FormSectionProps) => {
    return (
        <Suspense fallback={<FormSectionSkeleton/>}>
            <ErrorBoundary fallback={<div>Something went wrong...</div>}>
                <FormSectionSuspense videoId={videoId}/>
            </ErrorBoundary>
        </Suspense>
    )
}

const FormSectionSuspense = ({videoId}:FormSectionProps) => {
    const utils=trpc.useUtils();
    const [video]=trpc.studio.getOne.useSuspenseQuery({id:videoId});
    const [categories]=trpc.categories.getMany.useSuspenseQuery();

    const update=trpc.videos.update.useMutation({
        onSuccess:() => {
            utils.studio.getMany.invalidate();
            utils.studio.getOne.invalidate({id:videoId});
            toast.success("Video updated"); 
        },
        onError: (error) => {
            toast   
            .error("Error updating video", { description: error.message });
        }
    });
    const form = useForm<z.infer<typeof videoUpdateSchema>>({
        resolver:zodResolver(videoUpdateSchema),
        defaultValues:video
    })

    const onSubmit = (data:z.infer<typeof videoUpdateSchema>) => {
        update.mutate(data);
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className='flex items-center justify-between mb-6'>
                    {/* {JSON.stringify(video)} */}
                    <div>
                        <h1 className='text-2xl font-bold'>
                            Video Detail
                        </h1>
                        <p className='text-xs text-muted-foreground'>Manage your video detail</p>
                    </div>

                    <div className='flex items-center gap-x-2'>
                        <Button 
                            type='submit' 
                            disabled={update.isPending}
                            className='min-w-[100px]'
                        >
                            {update.isPending ?(
                                <>
                                    <Loader2Icon className='animate-spin size-4'/>
                                </>
                                
                            ):(
                                <span>Save</span>
                            )
                            }
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant={"ghost"} size={"icon"}>
                                    <MoreVerticalIcon className='size-6'/>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                                <DropdownMenuItem>
                                    <TrashIcon className='size-4 mr-2'/>
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <div className='grid grid-cols-1 lg:grid-cols-5 gap-6'>
                    <div className='space-y-8 lg:col-span-3'>
                        <FormField
                            control={form.control}
                            name='title'
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>
                                        Title
                                        {/* TODO : Add AI Generate Button */}
                                    </FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field} 
                                            placeholder='Add a title to your video' 
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='description'
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>
                                        Description
                                        {/* TODO : Add AI Generate Button */}
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea 
                                            {...field} 
                                            value={field.value ?? ""}
                                            rows={10}
                                            className='resize-none pr-10 min-h-[200px]'
                                            placeholder='Add a description to your video' 
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* TODO : Add Thumbnail Field Here */}

                        <FormField
                            control={form.control}
                            name='categoryId'
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>
                                        Category
                                        {/* TODO : Add AI Generate Button */}
                                    </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value ?? undefined}
                                            >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select a category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem key={category.id} value={category.id}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        
                    </div>
                </div>
            </form>
        </Form>
    )
}

const FormSectionSkeleton = () => {
    return (
        <div>Loading...</div>
    )
}

export default FormSection