import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import type { Meeting } from "@prisma/client";
import { env } from "~/env.mjs";

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
  create: publicProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        startTime: z.string(),
        endTime: z.string(),
        location: z.object({
          coordinates: z.array(z.number()),
        }),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const creatorId = "cloetyyfr0000tr7ox20gpl4u";
      try {
        const startDate = new Date(input.startTime);
        const endDate = new Date(input.endTime);

        const startTime = startDate.getTime();
        const endTime = endDate.getTime();
        const response = await ctx.db.$queryRaw`
          INSERT INTO "Meeting" (
            "id",
            "creatorId",
            "title",
            "description",
            "startTime",
            "endTime",
            "location",
            "createdAt"
          ) 
          VALUES (
            uuid_generate_v4(),
            ${creatorId},
            ${input.title},
            ${input.description},
            to_timestamp(${startTime} / 1000),
            to_timestamp(${endTime} / 1000),
            ST_MakePoint(${input.location.coordinates[0]}, ${input.location.coordinates[1]}),
            NOW()
          ) RETURNING *;
        `;

        return response;
      } catch (error) {
        console.error(error);
      }
    }),
  updateBackgroundImage: publicProcedure
    .input(z.object({ meetingId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const result = ctx.db.meeting.update({
          where: { id: input.meetingId },
          data: {
            backgroundImage:
              env.NEXTAUTH_URL +
              "/api/images/" +
              input.meetingId +
              "/bg-image.png",
          },
        });
        return result;
      } catch (error) {
        console.error(error);
      }
    }),
});
