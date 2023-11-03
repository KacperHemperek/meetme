import { z } from "zod";
import { env } from "~/env.mjs";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const mapSearchRouter = createTRPCRouter({
  searchByName: publicProcedure
    .input(
      z.object({
        city: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${input.city}.json?access_token=${env.NEXT_PUBLIC_MAPBOX_TOKEN}`,
        );
        const data = await response.json();

        return {
          data,
        };
      } catch (e) {}
    }),
});
