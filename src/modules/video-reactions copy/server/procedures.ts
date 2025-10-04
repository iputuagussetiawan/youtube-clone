import { db } from "@/db";
import { videoReactions } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { vi } from "date-fns/locale";
import { and, eq } from "drizzle-orm";
import z from "zod";

export const videoReactionsRouter = createTRPCRouter({
    like: protectedProcedure
    .input(z.object({videoId:z.uuid()}))
    .mutation(async ({ctx, input}) => {
        const {id:userId} = ctx.user;
        const {videoId} = input;
        const [existingVideoReactionLike]=await db
        .select()
        .from(videoReactions)
        .where(
            and(
                eq(videoReactions.userId,userId),
                eq(videoReactions.videoId,videoId),
                eq(videoReactions.type,"LIKE")
            )
        )
        if(existingVideoReactionLike){
            const [deletedViewerReaction]=await db
            .delete(videoReactions)
            .where(
                and(
                    eq(videoReactions.userId,userId),
                    eq(videoReactions.videoId,videoId),
                )
            )
            .returning()
            return deletedViewerReaction
        }

        const [createdVideoReaction]=await db
        .insert(videoReactions)
        .values({
            userId,
            videoId,
            type:"LIKE"
        })
        .onConflictDoUpdate({
            target: [videoReactions.userId,videoReactions.videoId],
            set: {
                type:"LIKE"
            }
        })
        .returning()
        return createdVideoReaction
    }),

    dislike: protectedProcedure
    .input(z.object({videoId:z.uuid()}))
    .mutation(async ({ctx, input}) => {
        const {id:userId} = ctx.user;
        const {videoId} = input;
        const [existingVideoReactionDislike]=await db
        .select()
        .from(videoReactions)
        .where(
            and(
                eq(videoReactions.userId,userId),
                eq(videoReactions.videoId,videoId),
                eq(videoReactions.type,"DISLIKE")
            )
        )
        if(existingVideoReactionDislike){
            const [deletedViewerReaction]=await db
            .delete(videoReactions)
            .where(
                and(
                    eq(videoReactions.userId,userId),
                    eq(videoReactions.videoId,videoId),
                )
            )
            .returning()
            return deletedViewerReaction
        }

        const [createdVideoReaction]=await db
        .insert(videoReactions)
        .values({
            userId,
            videoId,
            type:"DISLIKE"
        })
        .onConflictDoUpdate({
            target: [videoReactions.userId,videoReactions.videoId],
            set: {
                type:"DISLIKE"
            }
        })
        .returning()
        return createdVideoReaction
    })
});