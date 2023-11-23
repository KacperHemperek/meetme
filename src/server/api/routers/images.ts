import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export const imagesRouter = createTRPCRouter({
  getPresignedUrl: publicProcedure
    .input(z.object({ meetingId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { meetingId } = input;

      const command: PutObjectCommand = new PutObjectCommand({
        Bucket: "meetme-app",
        Key: `${meetingId}/image.png`,
      });
      const url: string = await getSignedUrl(ctx.s3Client, command);
      return { url };
    }),
});
