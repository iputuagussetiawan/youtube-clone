import { z } from 'zod';
import { protectedProcedure, createTRPCRouter, baseProcedure } from '../init';
export const appRouter = createTRPCRouter({
    hello: protectedProcedure
    .input(
        z.object({
            text: z.string(),
        }),
    )
    .query((opts) => {
        // throw new TRPCError({ code: "BAD_REQUEST" });
        console.log({dbUser: opts.ctx.user});
        return {
            greeting: `hello ${opts.input.text}`,
        };
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;