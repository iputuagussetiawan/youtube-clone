import VideoView from '@/modules/videos/ui/view/video-view'
import { HydrateClient, trpc } from '@/trpc/server'
import React from 'react'
interface PageProps {
    params:Promise<{
        videoId:string
    }>
}
const page =async ({params}:PageProps) => {
    const {videoId} = await params
    void trpc.videos.getOne.prefetch({id:videoId});
    //TODO: prefetchInfinite comments
    void trpc.comments.getMany.prefetch({videoId:videoId});
    return (
        <HydrateClient>
            <VideoView videoId={videoId}/>
        </HydrateClient>
    )
}

export default page