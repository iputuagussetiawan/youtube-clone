import { z } from "zod";
import { db } from "@/db";
import { videos } from "@/db/schema";
import { createTRPCRouter, baseProcedure } from "@/trpc/init";
import { eq, and, or, lt, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const suggestionsRouter = createTRPCRouter({
    getMany: baseProcedure
        .input(
            z.object({
                videoId: z.uuid(),
                cursor: z
                    .object({
                        id: z.uuid(),
                        updatedAt: z.date(),
                    })
                    .nullish(),
                limit: z.number().min(1).max(100),
            }),
        )
        .query(async ({input }) => {
            const { cursor,videoId, limit } = input;
            
            const [existingVideo]=await db
            .select()
            .from(videos)
            .where(eq(videos.id,videoId))
            

            if(!existingVideo){
                throw new TRPCError({ code: "NOT_FOUND" });
            }

            const data = await db
                .select()
                .from(videos)
                .where(
                    and(
                        existingVideo.categoryId
                        ?
                        eq(videos.categoryId, existingVideo.categoryId)
                        :undefined,
                        cursor
                        ? or(
                            lt(videos.updatedAt, cursor.updatedAt),
                            and(
                                eq(videos.updatedAt, cursor.updatedAt),
                                lt(videos.id, cursor.id),
                            ),
                        )
                        : undefined,
                    ),
                )
                .orderBy(desc(videos.updatedAt), desc(videos.id))
                .limit(limit + 1);

            const hasMore = data.length > limit;

            //remove the last one if it has more
            const items = hasMore ? data.slice(0, -1) : data;

            //set the next cursor to the last item if there is more data
            const lastItem = items[items.length - 1];
            const nextCursor = hasMore
                ? {
                      id: lastItem.id,
                      updatedAt: lastItem.updatedAt,
                  }
                : null;

            return {
                items,
                nextCursor,
            };
        }),
});
