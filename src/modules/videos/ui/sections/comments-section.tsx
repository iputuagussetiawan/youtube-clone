"use client";
import InfiniteScroll from '@/components/infinite-scroll';
import { DEFAULT_LIMIT } from '@/constant';
import CommentForm from '@/modules/comments/ui/components/comment-form';
import CommentItem from '@/modules/comments/ui/components/comment-item';
import { trpc } from '@/trpc/client';
import { Loader2Icon } from 'lucide-react';
import React from 'react'

interface CommentsSectionProps {
    videoId: string
}

export const CommentsSection = ({videoId}:CommentsSectionProps) => {
    return (
        <React.Suspense fallback={<CommentsSectionSkeleton />}>
            <CommentsSectionSuspense videoId={videoId}/>
        </React.Suspense>
    )
}

const CommentsSectionSkeleton = () => {
    return (
        <div className='mt-6 flex justify-center items-center'>
            <Loader2Icon className='text-muted-foreground size-7 animate-spin'/>
        </div>
    )
}

const CommentsSectionSuspense = ({videoId}:CommentsSectionProps) => {
    const [comments, query]=trpc.comments.getMany.useSuspenseInfiniteQuery({
        videoId:videoId,
        limit:DEFAULT_LIMIT
    },{
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    });
    return (
        <div className='mt-6'>
            <div className="flex flex-col gap-6">
                <h2 className='text-xl font-semibold'>{comments.pages[0].totalCount} Comments</h2>
                <CommentForm videoId={videoId}/>
                <div className="flex flex-col gap-4 mt-2">
                    {comments.pages.flatMap((page) => page.items).map((comment) => (
                        <CommentItem key={comment.id} comment={comment}/>
                    ))}
                    <InfiniteScroll
                        isManual
                        hasNextPage={query.hasNextPage}
                        isFetchingNextPage={query.isFetchingNextPage}
                        fetchNextPage={query.fetchNextPage}
                    />
                </div>
            </div>
        </div>
    )
}

export default CommentsSection