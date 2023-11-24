import { PutObjectCommand, type S3Client } from "@aws-sdk/client-s3";
import { env } from "~/env.mjs";
import { getBufferFromURL } from "~/utils/get-buffer-from-url";

/**
 *
 * @param client S3Client if used in trpc context use ctx.s3Client else just import the client
 * @param path string path to upload to in the bucket CANNOT START WITH '/'
 * @param image image object with dataUrl, type and name
 * @returns image url for meetme application proxy to s3
 *
 * @example Usage in a trpc context
 * ```js
 * const path = "some/path/" + image.name;
 *
 * const imageUrl = await uploadImage(ctx.s3Client, path, {
 *   dataUrl: input.image.dataUrl,
 *   name: input.image.name,
 *   type: input.image.contentType,
 * });
 * ```
 *
 * @example Usage outside of a trpc context
 * ```js
 * import { S3Client } from "@aws-sdk/client-s3";
 *
 * const s3Client = new S3Client({}); // pass in config if needed
 *
 * const path = "some/path/" + image.name;
 *
 * const imageUrl = await uploadImage(s3Client, path, {
 *   dataUrl: image.dataUrl,
 *   name: image.name,
 *   type: image.contentType,
 * });
 * ```
 */
export async function uploadImage(
  client: S3Client,
  path: string,
  image: {
    dataUrl: string;
    type: string;
    name: string;
  },
): Promise<string> {
  const imageBuffer = await getBufferFromURL(
    image.dataUrl,
    image.name,
    image.type,
  );

  const putObjCommand = new PutObjectCommand({
    Bucket: "meetme-app",
    Key: path,
    Body: imageBuffer,
    ContentType: image.type,
  });

  await client.send(putObjCommand);

  const imageUrl = `${env.NEXTAUTH_URL}/api/images/${path}`;

  return imageUrl;
}
