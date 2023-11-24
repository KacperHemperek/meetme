import { PrismaClient } from "@prisma/client";
import {
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
