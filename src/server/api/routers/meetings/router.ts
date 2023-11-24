import { createTRPCRouter } from "~/server/api/trpc";

import {
  createMeetingController,
  getAllMeetingsController,
  getMeetingByIdController,
} from "~/server/api/routers/meetings/controllers";

export const meetingsRouter = createTRPCRouter({
  getById: getMeetingByIdController,
  getAll: getAllMeetingsController,
  create: createMeetingController,
});
