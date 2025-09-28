import React, { useMemo } from 'react'
import { VideoGetOneOutput } from '../../type'
import VideoOwner from './video-owner'
import VideoReactions from './video-reactions'
import VideoMenu from './video-menu'
import VideoDescription from './video-description'
import { format, formatDistanceToNow } from 'date-fns'

interface VideoTopRowProps {
    video:VideoGetOneOutput
}

// TODO:implement functionality Video Right Menu
const VideoTopRow = ({video}:VideoTopRowProps) => {
    const compactViews=useMemo(()=>{
        return Intl.NumberFormat("en",{
            notation: "compact",
        }).format(video.viewCount);

    },[video.viewCount])
    const expandedViews=useMemo(()=>{
        return Intl.NumberFormat("en",{
            notation: "standard",
        }).format(video.viewCount);

    },[video.viewCount])

    const compactDate=useMemo(()=>{
        return formatDistanceToNow(video.createdAt,{addSuffix: true});
    },[])

    const expandedDate=useMemo(()=>{
        return format(video.createdAt,"d MMM yyyy");
    },[])
    return (
        <div className='flex flex-col mt-4 mb-4'>
            <h1 className='text-xl font-semibold'>
                {video.title}
            </h1>
            <div className='flex flex-col items-center sm:flex-row sm:item-start sm:justify-between gap-4'>
                <VideoOwner user={video.user} videoId={video.id}/>
                <div className='flex overflow-x-auto sm:min-w-[calc(50%-6px)] sm:justify-end sm:overflow-visible pb-2 -mb-2 sm:pb-0 sm:mb-0 gap-2'>
                    <VideoReactions
                        videoId={video.id}
                        likes={video.likeCount}
                        dislikes={video.dislikeCount}
                        viewerReaction={video.viewerReaction}
                    />
                    <VideoMenu videoId={video.id} variant='secondary'/>
                </div>
            </div>

            <VideoDescription 
                compactViews={compactViews}
                expandedViews={expandedViews}
                compactDate={compactDate}
                expandedDate={expandedDate}
                description={video.description}
            />
        </div>
    )
}



export default VideoTopRow