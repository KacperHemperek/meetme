import { PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from "~/env.mjs";
import {
  createMeetingSchema,
  getMeetingByIdSchema,
} from "~/server/api/routers/meetings/schema";
import { getAllMeetings } from "~/server/api/routers/meetings/services";
import type {
  MeetingWithLocation,
  MeetingWithLocationString,
} from "~/server/api/routers/meetings/types";
import { publicProcedure } from "~/server/api/trpc";
import { getBufferFromURL } from "~/utils/get-buffer-from-url";

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

      const imageExtension = input.image?.contentType.split("/")[1];
      const imageName = `bg-image.${imageExtension}`;

      const imageBuffer = await getBufferFromURL(
        input.image?.dataUrl,
        imageName,
        input.image?.contentType,
      );

      const path = `${uuid}/${imageName}`;

      const putObjCommand = new PutObjectCommand({
        Bucket: "meetme-app",
        Key: path,
        Body: imageBuffer,
        ContentType: input.image?.contentType,
      });

      await ctx.s3Client.send(putObjCommand);

      const fullUrl = `${env.NEXTAUTH_URL}/api/images/${path}`;

      const response = await ctx.db.$queryRaw`
      INSERT INTO "Meeting" (
        "id",
        "creatorId",
        "title",
        "description",
        "startTime",
        "endTime",
        "location",
        "createdAt",
        "backgroundImage"
      )
      VALUES (
        ${uuid},
        ${creatorId},
        ${input.title},
        ${input.description},
        to_timestamp(${startTime} / 1000),
        to_timestamp(${endTime} / 1000),
        ST_MakePoint(${input.location.coordinates[0]}, ${input.location.coordinates[1]}),
        NOW(),
        ${fullUrl}
      ) RETURNING 
        "id",
        "creatorId",
        "title",
        "description",
        "startTime",
        "endTime",
        ST_AsGeoJSON(location) as location,
        "createdAt",
        "backgroundImage";
    `;

      return response;
    } catch (error) {
      console.error(error);
    }
  });
