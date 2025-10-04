"use client";
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
        <div>
            {JSON.stringify(comments)}
        </div>
    )
}

export default CommentsSection