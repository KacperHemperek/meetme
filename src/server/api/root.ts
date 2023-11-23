import { imagesRouter } from "~/server/api/routers/images";
import { meetingsRouter } from "~/server/api/routers/meetings";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  meetings: meetingsRouter,
  images: imagesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
