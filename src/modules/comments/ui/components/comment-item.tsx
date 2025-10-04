import Link from "next/link";
import { CommentsGetManyOutput } from "../../types";

interface CommentItemProps {
    comment: CommentsGetManyOutput["items"][number];
    variant?: "comment" | "reply";
}   

import React, { useState } from 'react'
import UserAvatar from "@/components/user-avatar";
import { formatDistanceToNow } from "date-fns";
import { trpc } from "@/trpc/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MessageSquareIcon, MoreVerticalIcon, ThumbsDownIcon, ThumbsUpIcon, Trash, Trash2Icon } from "lucide-react";
import { useAuth, useClerk } from "@clerk/nextjs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import CommentForm from "./comment-form";

const CommentItem = ({comment, variant="comment"}:CommentItemProps) => {
    const [isReplayOpen, setIsReplayOpen] = useState(false);
    const [isRepliesOpen, setIsRepliesOpen] = useState(false);
    const clerk=useClerk();
    const {userId}=useAuth();
    const utils=trpc.useUtils();
    const remove=trpc.comments.remove.useMutation({
        onSuccess: () => {
            toast.success("Comment deleted");
            utils.comments.getMany.invalidate({videoId:comment.videoId});
        },
        onError: (error) => {
            toast.error("Something went wrong");
            if (error.data?.code === "UNAUTHORIZED") {
                clerk.openSignIn();
            }
        },
    });

    const like=trpc.commentReactions.like.useMutation({
        onSuccess: () => {
            toast.success("Comment liked");
            utils.comments.getMany.invalidate({videoId:comment.videoId});
        },
        onError: (error) => {
            toast.error("Something went wrong");
            if (error.data?.code === "UNAUTHORIZED") {
                clerk.openSignIn();
            }
        },
    })

    const dislike=trpc.commentReactions.dislike.useMutation({
        onSuccess: () => {
            toast.success("Comment disliked");
            utils.comments.getMany.invalidate({videoId:comment.videoId});
        },
        onError: (error) => {
            toast.error("Something went wrong");
            if (error.data?.code === "UNAUTHORIZED") {
                clerk.openSignIn();
            }
        },
    })
    return (
        <div>
            <div className="flex gap-4">
                <Link href={`/users/${comment.userId}`}>
                    <UserAvatar size="lg" imageUrl={comment.user.imageUrl} name={comment.user.name} />
                </Link>
                <div className="flex-1 min-w-0">
                    <Link href={`/users/${comment.userId}`}>
                    <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-medium text-sm pb-0.5">{ comment.user.name}</span>
                        <span className="text-xs text-muted-foreground"> {formatDistanceToNow(comment.createdAt,{
                            addSuffix: true
                        } )}</span>
                    </div>
                    </Link>
                    <p className="text-sm">{comment.value}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center">
                            <Button
                            disabled={like.isPending}
                            variant={"ghost"}
                            size={"icon"}
                            className="size-8"
                            onClick={() => like.mutate({commentId:comment.id})}
                            >
                                <ThumbsUpIcon className={cn(comment.viewerReaction === "LIKE" ? "fill-black" : "")} />
                            </Button> 
                            <span className="text-xs text-muted-foreground">{comment.likeCount}</span>
                            <Button
                            disabled={dislike.isPending}
                            variant={"ghost"}
                            size={"icon"}
                            className="size-8"
                            onClick={() => dislike.mutate({commentId:comment.id})}
                            >
                                <ThumbsDownIcon className={cn(comment.viewerReaction === "DISLIKE" ? "fill-black" : "")} />
                            </Button>
                            <span className="text-xs text-muted-foreground">{comment.dislikeCount}</span>
                        </div>
                        {variant==="comment" && (
                            <Button 
                                variant={"ghost"} 
                                size={"sm"} 
                                className="h-8" 
                                onClick={() => setIsReplayOpen(true)}
                            >
                                Replay
                            </Button>
                        )}
                    </div>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8" >
                            <MoreVerticalIcon />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {variant==="comment" && (    
                            <DropdownMenuItem onClick={() => setIsReplayOpen(true)}>
                                <MessageSquareIcon className="size-4" />
                                Replay
                            </DropdownMenuItem>
                        )}
                        {
                            comment.user.clerkId === userId && (
                                <DropdownMenuItem onClick={() => remove.mutate({id:comment.id})}>
                                    <Trash2Icon className="size-4" />
                                    Remove
                                </DropdownMenuItem>
                            )
                        }
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {isReplayOpen && variant==="comment" && (
                <div className="mt-4 pl-14">
                    <CommentForm
                        variant="reply"
                        parentId={comment.id}
                        videoId={comment.videoId}
                        onCancel={() => setIsReplayOpen(false)}
                        onSuccess={() => {
                            setIsReplayOpen(false);
                            setIsRepliesOpen(true)
                        }}
                    />
                </div>  
            )}

            {comment.replayCount > 0 && variant==="comment" && (
                <div className="pl-14">
                    <Button
                    >
                        {comment.replayCount} replies
                    </Button>
                </div>
            )}
        </div>
    )
}

export default CommentItem