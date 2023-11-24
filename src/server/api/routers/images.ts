import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export const imagesRouter = createTRPCRouter({
  getPresignedUrl: publicProcedure
    .input(
      z.object({
        meetingId: z.string(),
        contentType: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { meetingId, contentType } = input;

      const fileType = contentType.split("/")[1];

      const command: PutObjectCommand = new PutObjectCommand({
        Bucket: "meetme-app",
        Key: `${meetingId}/image.${fileType}`,
        ContentType: contentType,
      });
      const url: string = await getSignedUrl(ctx.s3Client, command);
      return { url };
    }),
});
