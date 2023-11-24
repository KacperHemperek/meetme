import type { Meeting } from "@prisma/client";

export type MeetingWithLocationString = Meeting & {
  location: string;
};

export type MeetingWithLocation = Meeting & {
  location: GeoJSON.Point;
};
