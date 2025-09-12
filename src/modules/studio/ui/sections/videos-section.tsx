"use client"

import InfiniteScroll from "@/components/infinite-scroll";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DEFAULT_LIMIT } from "@/constant";
import VideoThumbnail from "@/modules/videos/ui/components/video-thumbnail";
import { trpc } from "@/trpc/client"
import Link from "next/link";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export const VideosSection = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ErrorBoundary fallback={<div>Something went wrong...</div>}>
                <VideosSectionSuspense />
            </ErrorBoundary>
        </Suspense>
    )
}
const VideosSectionSuspense = () => {
    const [videos, query]=trpc.studio.getMany.useSuspenseInfiniteQuery({
        limit:DEFAULT_LIMIT
    },{
        getNextPageParam:(lastPage)=>lastPage.nextCursor,
    });

    return (
        <div>
            <div className="border-y">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="pl-6 w-[510px]">Video</TableHead>
                            <TableHead>Visibility</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Views</TableHead>
                            <TableHead className="text-right">Comment</TableHead>
                            <TableHead className="text-right pr-6">Like</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            videos.pages.flatMap((page)=>page.items).map((video)=>(
                                <Link key={video.id} href={`/studio/videos/${video.id}`} legacyBehavior>
                                    <TableRow className="cursor-pointer" >
                                        <TableCell>
                                            <div className="flex items-center gap-4">
                                                <div className="relative aspect-video w-36 shrink-0">
                                                    <VideoThumbnail 
                                                        imageUrl={video.thumbnailUrl} 
                                                        previewUrl={video.previewUrl} 
                                                        title={video.title}
                                                        duration={video.duration || 0}
                                                    />
                                                </div>
                                                <div className="flex flex-col overflow-hidden gap-y-1">
                                                    <span className="text-sm line-clamp-1">{video.title}</span>
                                                    <span className="text-xs line-clamp-1 text-muted-foreground">{video.description || "No description"}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            visibility
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center">
                                                {video.muxStatus}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            Date
                                        </TableCell>
                                        <TableCell className="text-right">
                                            Views
                                        </TableCell>
                                        <TableCell className="text-right">
                                            commentCount
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            likeCount
                                        </TableCell>
                                    </TableRow>
                                </Link>
                            )) 
                        }
                    </TableBody>
                </Table>
            </div>
            <InfiniteScroll 
                isManual
                hasNextPage={query.hasNextPage} 
                isFetchingNextPage={query.isFetchingNextPage} 
                fetchNextPage={query.fetchNextPage} 
            />
        </div>
    )
}