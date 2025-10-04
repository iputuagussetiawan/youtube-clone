import { db } from "@/db";
import {  commentReactions, comments, users } from "@/db/schema";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { vi } from "date-fns/locale";
import { and, count, desc, eq, getTableColumns, inArray, lt, or } from "drizzle-orm";
import { view } from "drizzle-orm/sqlite-core";
import z from "zod";

export const commentsRouter = createTRPCRouter({
    remove: protectedProcedure
    .input(z.object({
        id:z.uuid()}))
    .mutation(async ({ctx, input}) => {
        const {id:userId} = ctx.user;
        const {id} = input;
        const [deletedComment] = await db
        .delete(comments)
        .where(
            and(
                eq(comments.id,id),
                eq(comments.userId,userId)
            )
        )
        .returning();

        if(!deletedComment){
            throw new TRPCError({code:"NOT_FOUND"})
        }
        return deletedComment
    }),
    create: protectedProcedure
    .input(z.object({
        parentId:z.string().nullish(),
        videoId:z.uuid(), 
        value:z.string()}))
    .mutation(async ({ctx, input}) => {
        const {id:userId} = ctx.user;
        const {videoId, parentId, value} = input;

        //check if parent comment exists
        const [existingComment]=await db
        .select()
        .from(comments)
        .where(
            inArray(comments.id,parentId?[parentId]:[])
        )

        //check if parent comment exists
        if(!existingComment && parentId){
            throw new TRPCError({code:"NOT_FOUND"})
        }
        
        //check if child comment exists
        if(existingComment?.parentId && parentId){
            throw new TRPCError({code:"NOT_FOUND"})
        }

        const [createdComment] = await db
        .insert(comments)
        .values({
            userId,
            videoId,
            parentId,
            value
        })
        .returning();
        return createdComment
    }),
    getMany:baseProcedure
    .input(z.object({
        videoId:z.uuid(),
        cursor:z.object({
            id:z.uuid(),
            updatedAt:z.date()
        }).nullish(),
        limit:z.number().min(1).max(100)
    }))
    .query(async ({input, ctx}) => {
        const {clerkUserId}=ctx;
        const {videoId, cursor, limit} = input;

        let userId;

        const [user]=await db
        .select()
        .from(users)
        .where(inArray(users.clerkId,clerkUserId?[clerkUserId]:[]))

        if(user){
            userId=user.id
        }

        const viewerReactions=db.$with("viewer_reactions").as(
            db.select({
                commentId:commentReactions.commentId,
                type:commentReactions.type,
            })
            .from(commentReactions)
            .where(inArray(commentReactions.userId,userId?[userId]:[]))
        )
        const [totalData,data]=await Promise.all([
            db.select({
                count:count()
            })
            .from(comments)
            .where(eq(comments.videoId,videoId)),

            db
                .with(viewerReactions)
                .select({
                ...getTableColumns(comments),
                user:users,
                viewerReaction:viewerReactions.type,
                likeCount:db.$count(commentReactions,
                    and(
                        eq(commentReactions.commentId,comments.id),
                        eq(commentReactions.type,"LIKE")
                    )
                ), 
                dislikeCount:db.$count(commentReactions,
                    and(
                        eq(commentReactions.commentId,comments.id),
                        eq(commentReactions.type,"DISLIKE")
                    )
                )
            })
            .from(comments)
            .where(and(
                eq(comments.videoId,videoId),
                cursor
                ? or(
                        lt(comments.updatedAt, cursor.updatedAt),
                        and(
                            eq(comments.updatedAt, cursor.updatedAt),
                            lt(comments.id, cursor.id),
                        ),
                    )
                : undefined,
            ))
            .innerJoin(users, eq(comments.userId, users.id))
            .leftJoin(viewerReactions, eq(comments.id, viewerReactions.commentId))
            .orderBy(desc(comments.updatedAt), desc(comments.id))
            .limit(limit + 1)
        ])

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
            totalCount:totalData[0].count,
            items,
            nextCursor,
        };
    })
});