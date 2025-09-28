import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react'
import React from 'react'
import { VideoGetOneOutput } from '../../type'
import { useClerk } from '@clerk/nextjs'
import { trpc } from '@/trpc/client'
import { toast } from 'sonner'

interface VideoReactionsProps {
    videoId:string;
    likes:number;
    dislikes:number;
    viewerReaction:VideoGetOneOutput["viewerReaction"];
}

const VideoReactions = ({
    videoId,
    likes,
    dislikes,
    viewerReaction
}:VideoReactionsProps) => {
    const clerk=useClerk()
    const utils=trpc.useUtils();

    const like=trpc.videoReactions.like.useMutation({
        onSuccess:()=>{
            utils.videos.getOne.invalidate({id:videoId})
            // TODO:invalidated liked playlist
        },
        onError:(error)=>{
            toast.error("Something went wrong");
            if(error.data?.code === "UNAUTHORIZED"){
                clerk.openSignIn();
            }
        },
    })

    const dislike=trpc.videoReactions.dislike.useMutation({
        onSuccess:()=>{
            utils.videos.getOne.invalidate({id:videoId})
            // TODO:invalidated liked playlist
        },
        onError:(error)=>{
            toast.error("Something went wrong");
            if(error.data?.code === "UNAUTHORIZED"){
                clerk.openSignIn();
            }
        },
    })
    return (
        <div className='flex items-center flex-none'>
            <Button 
                onClick={() => like.mutate({videoId})}
                disabled={like.isPending || dislike.isPending}
                variant={"secondary"}
                className='rounded-l-full rounded-r-none gap-2 pr-4'
            >
                <ThumbsUpIcon className={cn("size-5", viewerReaction === "LIKE" && "fill-black")} />
                {likes}
            </Button>
            <Separator orientation='vertical' className='h-5'/>
            
            <Button
                onClick={() => dislike.mutate({videoId})}
                disabled={like.isPending || dislike.isPending}
                variant={"secondary"}
                className='rounded-l-none rounded-r-full pl-3'
            >
                <ThumbsDownIcon className={cn("size-5", viewerReaction === "DISLIKE" && "fill-black")} />
                {dislikes || 0}
            </Button>
        </div>
    )
}

export default VideoReactions