import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import type { Meeting } from "@prisma/client";

type MeetingWithLocationString = Meeting & {
  location: string;
};

export type MeetingWithLocation = Meeting & {
  location: GeoJSON.Point;
};

export const meetingsRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const { id } = input;
      try {
        const [meeting]: MeetingWithLocationString[] = await ctx.db.$queryRaw`
          SELECT 
            ST_AsGeoJSON(location) as location,
            "title",
            "description",
            "id",
            "startTime",
            "endTime"
          FROM "Meeting"
          WHERE "id" = ${id};
        `;

        const meetingWithLocation: MeetingWithLocation | undefined = meeting
          ? {
              ...meeting,
              location: JSON.parse(meeting.location) as GeoJSON.Point,
            }
          : undefined;

        return meetingWithLocation;
      } catch (error) {
        console.error(error);
      }
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    try {
      const meetings: MeetingWithLocationString[] = await ctx.db.$queryRaw`
          SELECT 
            ST_AsGeoJSON(location) as location,
            "title",
            "description",
            "id",
            "startTime",
            "endTime"
          FROM "Meeting";
        `;

      const meetingsWithLocation: MeetingWithLocation[] = meetings.map(
        (meeting) => ({
          ...meeting,
          location: JSON.parse(meeting.location) as GeoJSON.Point,
        }),
      );
      return meetingsWithLocation;
    } catch (error) {
      console.error(error);
    }
  }),
});
