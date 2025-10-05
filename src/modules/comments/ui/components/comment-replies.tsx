interface CommentRepliesProps {
    parentId: string;
    videoId: string;
}

import { DEFAULT_LIMIT } from '@/constant';
import { trpc } from '@/trpc/client';
import { CornerDownRightIcon, Loader2Icon } from 'lucide-react';
import React from 'react'
import CommentItem from './comment-item';
import { Button } from '@/components/ui/button';

const CommentReplies = ({ videoId, parentId}:CommentRepliesProps) => {
    const {
        data, 
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    }=trpc.comments.getMany.useInfiniteQuery({
        limit:DEFAULT_LIMIT,
        videoId:videoId,
        parentId:parentId
    },{
        getNextPageParam: (lastPage) => lastPage.nextCursor
    })
    return (
        <div className='pl-14'>
            <div className='flex flex-col gap-4 mt-2'>
                {isLoading && (
                    <div className='flex justify-center items-center'>
                        <Loader2Icon className='text-muted-foreground size-7 animate-spin'/>
                    </div>
                )}
                {!isLoading && 
                    data?.pages.flatMap((page) => page.items).map((comment) => (
                        <div key={comment.id}>
                            <CommentItem key={comment.id} comment={comment} variant='reply'/>
                        </div>
                    ))
                }
            </div>
            {
                hasNextPage && (
                    <Button 
                        variant={"tertiary"}
                        size={"sm"}
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                    >
                        <CornerDownRightIcon className="h-4 w-4" />
                        Show More replies
                    </Button>
                )
            }
        </div>
    )
}

export default CommentReplies