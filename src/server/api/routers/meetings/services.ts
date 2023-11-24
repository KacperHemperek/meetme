import type { PrismaClient } from "@prisma/client";
import type {
  CreateMeetingServiceData,
  CreateMeetingWithImageServiceData,
  MeetingWithLocation,
  MeetingWithLocationString,
} from "~/server/api/routers/meetings/types";

export async function getAllMeetings(db: PrismaClient) {
  const meetings: MeetingWithLocationString[] = await db.$queryRaw`
        SELECT 
          ST_AsGeoJSON(location) as location,
          "title",
          "description",
          "id",
          "startTime",
          "endTime",
          "backgroundImage"
        FROM "Meeting";
      `;

  const meetingsWithLocation: MeetingWithLocation[] = meetings.map(
    (meeting) => ({
      ...meeting,
      location: JSON.parse(meeting.location) as GeoJSON.Point,
    }),
  );

  return meetingsWithLocation;
}

export async function createMeetingWithImage(
  db: PrismaClient,
  data: CreateMeetingWithImageServiceData,
) {
  const {
    coordinates,
    creatorId,
    description,
    endTime,
    imageUrl,
    startTime,
    title,
    uuid,
  } = data;

  const response = await db.$queryRaw`
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
        ${title},
        ${description},
        to_timestamp(${startTime} / 1000),
        to_timestamp(${endTime} / 1000),
        ST_MakePoint(${coordinates[0]}, ${coordinates[1]}),
        NOW(),
        ${imageUrl}
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
}

export async function createMeetingWithoutImage(
  db: PrismaClient,
  data: CreateMeetingServiceData,
) {
  const {
    coordinates,
    creatorId,
    description,
    endTime,
    startTime,
    title,
    uuid,
  } = data;

  const response = await db.$queryRaw`
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
        ${uuid},
        ${creatorId},
        ${title},
        ${description},
        to_timestamp(${startTime} / 1000),
        to_timestamp(${endTime} / 1000),
        ST_MakePoint(${coordinates[0]}, ${coordinates[1]}),
        NOW(),
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
}
