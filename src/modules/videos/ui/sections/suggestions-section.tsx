"use client"
import { DEFAULT_LIMIT } from '@/constant'
import { trpc } from '@/trpc/client'
import React from 'react'

interface SuggestionsSectionProps {
    videoId:string
}

const SuggestionsSection = ({videoId}:SuggestionsSectionProps) => {
    const suggestions=trpc.suggestions.getMany.useInfiniteQuery({
        videoId:videoId,
        limit:DEFAULT_LIMIT
    },{
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    });
    return (
        <div>
            {JSON.stringify(suggestions)}
        </div>
    )
}

export default SuggestionsSection