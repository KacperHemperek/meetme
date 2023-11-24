import { z } from "zod";

export const getMeetingByIdSchema = z.object({ id: z.string() });

export const createMeetingSchema = z.object({
  title: z.string(),
  description: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  location: z.object({
    coordinates: z.array(z.number()),
  }),
  image: z
    .object({
      dataUrl: z.string(),
      contentType: z.string(),
    })
    .nullable(),
});
