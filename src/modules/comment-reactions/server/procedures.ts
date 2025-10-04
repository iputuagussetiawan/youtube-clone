import { db } from "@/db";
import { commentReactions } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, eq } from "drizzle-orm";
import z from "zod";

export const commentReactionsRouter = createTRPCRouter({
    like: protectedProcedure
    .input(z.object({commentId:z.uuid()}))
    .mutation(async ({ctx, input}) => {
        const {id:userId} = ctx.user;
        const {commentId} = input;
        const [existingCommentReactionLike]=await db
        .select()
        .from(commentReactions)
        .where(
            and(
                eq(commentReactions.commentId,commentId),
                eq(commentReactions.userId,userId),
                eq(commentReactions.type,"LIKE")
            )
        )
        if(existingCommentReactionLike){
            const [deletedViewerReaction]=await db
            .delete(commentReactions)
            .where(
                and(
                    eq(commentReactions.userId,userId),
                    eq(commentReactions.commentId,commentId),
                )
            )
            .returning()
            return deletedViewerReaction
        }

        const [createdCommentReaction]=await db
        .insert(commentReactions)
        .values({
            userId,
            commentId,
            type:"LIKE"
        })
        .onConflictDoUpdate({
            target: [commentReactions.userId,commentReactions.commentId],
            set: {
                type:"LIKE"
            }
        })
        .returning()
        return createdCommentReaction
    }),

    dislike: protectedProcedure
    .input(z.object({commentId:z.uuid()}))
    .mutation(async ({ctx, input}) => {
        const {id:userId} = ctx.user;
        const {commentId} = input;
        const [existingCommentReactionDislike]=await db
        .select()
        .from(commentReactions)
        .where(
            and(
                eq(commentReactions.commentId,commentId),
                eq(commentReactions.userId,userId),
                eq(commentReactions.type,"DISLIKE")
            )
        )
        if(existingCommentReactionDislike){
            const [deletedViewerReaction]=await db
            .delete(commentReactions)
            .where(
                and(
                    eq(commentReactions.userId,userId),
                    eq(commentReactions.commentId,commentId),
                )
            )
            .returning()
            return deletedViewerReaction
        }

        const [createdCommentReaction]=await db
        .insert(commentReactions)
        .values({
            userId,
            commentId,
            type:"DISLIKE"
        })
        .onConflictDoUpdate({
            target: [commentReactions.userId,commentReactions.commentId],
            set: {
                type:"DISLIKE"
            }
        })
        .returning()
        return createdCommentReaction
    })
});