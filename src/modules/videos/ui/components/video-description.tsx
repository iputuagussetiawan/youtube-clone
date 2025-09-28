interface VideoDescriptionProps {
    compactViews: string,
    expandedViews: string,
    compactDate: string,
    expandedDate: string,
    description?: string | null;
}

import { cn } from '@/lib/utils';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import React, { useState } from 'react'

const VideoDescription = ({ description, compactViews, expandedViews, compactDate, expandedDate}:VideoDescriptionProps) => {
    const [isExpended, setIsExpanded] = useState(false);
    return (
        <div 
            onClick={() => setIsExpanded((current)=> !current)}
            className='bg-secondary/50 rounded-xl p-3 cursor-pointer hover:bg-secondary/70 transition' 
        >
            <div className="flex gap-2 text-sm mb-2">
                <span className='font-medium'>
                    {isExpended ? expandedViews : compactViews} views
                </span>
                <span className='font-medium'>
                    {isExpended ? expandedDate : compactDate}
                </span>
            </div>
            <div className='relative'>
                <div className={cn('text-sm whitespace-pre-wrap', !isExpended && "line-clamp-2")}>
                    {description || "No description"}
                </div>
                <div className='flex items-center gap-1 mt-4 text-sm font-medium'>
                    {isExpended?(
                        <>Show Less <ChevronUpIcon className='size-4'/></>
                    ):(
                        <>Show More <ChevronDownIcon className='size-4'/></>
                    )}
                </div>
            </div>
        </div>
    )
}

export default VideoDescription