import { S3Client, type S3ClientConfig } from "@aws-sdk/client-s3";
import { env } from "~/env.mjs";

const config: S3ClientConfig = {
  credentials: {
    accessKeyId: env.AWS_S3_ACCESS_KEY,
    secretAccessKey: env.AWS_S3_SECRET_KEY,
  },
  region: "eu-central-1",
};

export const s3Client = new S3Client(config);
