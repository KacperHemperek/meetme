import {
  createMeetingSchema,
  getMeetingByIdSchema,
} from "~/server/api/routers/meetings/schema";
import {
  createMeetingWithImage,
  createMeetingWithoutImage,
  getAllMeetings,
} from "~/server/api/routers/meetings/services";
import type {
  MeetingWithLocation,
  MeetingWithLocationString,
} from "~/server/api/routers/meetings/types";
import { publicProcedure } from "~/server/api/trpc";
import { uploadImage } from "~/server/lib/s3";

export const getAllMeetingsController = publicProcedure.query(
  async ({ ctx }) => {
    try {
      const meetings = await getAllMeetings(ctx.db);
      return meetings;
    } catch (error) {
      console.error(error);
    }
  },
);

export const getMeetingByIdController = publicProcedure
  .input(getMeetingByIdSchema)
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
        "endTime",
        "backgroundImage"
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
  });

export const createMeetingController = publicProcedure
  .input(createMeetingSchema)
  .mutation(async ({ input, ctx }) => {
    const creatorId = "cloetyyfr0000tr7ox20gpl4u";
    try {
      const uuid = crypto.randomUUID();
      const startDate = new Date(input.startTime);
      const endDate = new Date(input.endTime);

      const startTime = startDate.getTime();
      const endTime = endDate.getTime();

      if (!input.image) {
        await createMeetingWithoutImage(ctx.db, {
          title: input.title,
          description: input.description,
          startTime,
          endTime,
          coordinates: input.location.coordinates,
          uuid,
          creatorId,
        });

        return;
      }

      const imageExtension = input.image?.contentType.split("/")[1];
      const imageName = `bg-image.${imageExtension}`;
      const path = `${uuid}/${imageName}`;

      const imageUrl = await uploadImage(ctx.s3Client, path, {
        dataUrl: input.image.dataUrl,
        name: imageName,
        type: input.image.contentType,
      });

      await createMeetingWithImage(ctx.db, {
        title: input.title,
        description: input.description,
        startTime,
        endTime,
        coordinates: input.location.coordinates,
        uuid,
        creatorId,
        imageUrl,
      });
    } catch (error) {
      console.error(error);
    }
  });
