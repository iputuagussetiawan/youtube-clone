"use client";
import CommentForm from '@/modules/comments/ui/components/comment-form';
import CommentItem from '@/modules/comments/ui/components/comment-item';
import { trpc } from '@/trpc/client';
import React from 'react'

interface CommentsSectionProps {
    videoId: string
}

export const CommentsSection = ({videoId}:CommentsSectionProps) => {
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <CommentsSectionSuspense videoId={videoId}/>
        </React.Suspense>
    )
}

const CommentsSectionSuspense = ({videoId}:CommentsSectionProps) => {
    const [comments]=trpc.comments.getMany.useSuspenseQuery({videoId:videoId});
    return (
        <div className='mt-6'>
            <div className="flex flex-col gap-6">
                <h2>0 Comments</h2>
                <CommentForm videoId={videoId}/>
                <div className="flex flex-col gap-4 mt-2">
                    {comments.map((comment) => (
                        <CommentItem key={comment.id} comment={comment}/>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default CommentsSection