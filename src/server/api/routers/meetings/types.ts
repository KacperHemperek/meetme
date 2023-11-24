import type { Meeting } from "@prisma/client";

export type MeetingWithLocationString = Meeting & {
  location: string;
};

export type MeetingWithLocation = Meeting & {
  location: GeoJSON.Point;
};

export type CreateMeetingServiceData = {
  uuid: string;
  creatorId: string;
  title: string;
  description: string;
  coordinates: number[];
  startTime: number;
  endTime: number;
};

export type CreateMeetingWithImageServiceData = CreateMeetingServiceData & {
  imageUrl: string;
};
