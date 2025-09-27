"use client";

import InfiniteScroll from "@/components/infinite-scroll";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { DEFAULT_LIMIT } from "@/constant";
import { snakeCaseToTitle } from "@/lib/utils";
import VideoThumbnail from "@/modules/videos/ui/components/video-thumbnail";
import { trpc } from "@/trpc/client";
import Link from "next/link";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { format } from "date-fns";
import { Globe2Icon, LockIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const VideosSection = () => {
    return (
        <Suspense fallback={<VideosSectionSkeleton />}>
            <ErrorBoundary fallback={<div>Something went wrong...</div>}>
                <VideosSectionSuspense />
            </ErrorBoundary>
        </Suspense>
    );
};

const VideosSectionSkeleton = () => {
    return (
        <>
            <div className="border-y">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="pl-6 w-[510px]">
                                Video
                            </TableHead>
                            <TableHead>Visibility</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Views</TableHead>
                            <TableHead className="text-right">
                                Comment
                            </TableHead>
                            <TableHead className="text-right pr-6">
                                Like
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: DEFAULT_LIMIT }).map(
                            (_, index) => (
                                <TableRow key={index}>
                                    <TableCell className="pl-6">
                                        <div className="flex items-center gap-4">
                                            <Skeleton className="h-20 w-36" />
                                            <div className="flex flex-col gap-2">
                                                <Skeleton className="h-4 w-[100px]" />
                                                <Skeleton className="h-3 w-[150px]" />
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-20" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-16" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-24" />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Skeleton className="h-4 w-12 ml-auto" />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Skeleton className="h-4 w-12 ml-auto" />
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <Skeleton className="h-4 w-12 ml-auto" />
                                    </TableCell>
                                </TableRow>
                            ),
                        )}
                    </TableBody>
                </Table>
            </div>
        </>
    );
};
const VideosSectionSuspense = () => {
    const [videos, query] = trpc.studio.getMany.useSuspenseInfiniteQuery(
        {
            limit: DEFAULT_LIMIT,
        },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        },
    );

    return (
        <div>
            <div className="border-y">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="pl-6 w-[510px]">
                                Video
                            </TableHead>
                            <TableHead>Visibility</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Views</TableHead>
                            <TableHead className="text-right">
                                Comment
                            </TableHead>
                            <TableHead className="text-right pr-6">
                                Like
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {videos.pages
                            .flatMap((page) => page.items)
                            .map((video) => (
                                <TableRow
                                    key={video.id}
                                    className="cursor-pointer"
                                >
                                    <TableCell className="pl-6">
                                        <div className="flex items-center gap-4">
                                            <div className="relative aspect-video w-36 shrink-0">
                                                <Link
                                                    href={`/studio/videos/${video.id}`}
                                                >
                                                    <VideoThumbnail
                                                        imageUrl={
                                                            video.thumbnailUrl
                                                        }
                                                        previewUrl={
                                                            video.previewUrl
                                                        }
                                                        title={video.title}
                                                        duration={
                                                            video.duration || 0
                                                        }
                                                    />
                                                </Link>
                                            </div>
                                            <div className="flex flex-col overflow-hidden gap-y-1">
                                                <span className="text-sm line-clamp-1">
                                                    {video.title}
                                                </span>
                                                <span className="text-xs line-clamp-1 text-muted-foreground">
                                                    {video.description ||
                                                        "No description"}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            {video.visibility === "private" ? (
                                                <LockIcon className="text-muted-foreground mr-2" />
                                            ) : (
                                                <Globe2Icon className="text-muted-foreground mr-2" />
                                            )}
                                            {snakeCaseToTitle(video.visibility)}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            {snakeCaseToTitle(
                                                video.muxStatus || "error",
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm truncate">
                                        {format(
                                            new Date(video.createdAt),
                                            "d MMM yyyy",
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right text-sm">
                                        Views
                                    </TableCell>
                                    <TableCell className="text-right text-sm">
                                        commentCount
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        likeCount
                                    </TableCell>
                                </TableRow>
                            ))}
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
    );
};
