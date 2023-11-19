import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { type NextApiHandler } from "next";
import { z } from "zod";
import { s3Client } from "~/server/s3client";

const pathSchema = z.array(z.string());

const getImageHandler: NextApiHandler = async (req, res) => {
  const { path } = req.query;

  try {
    res.setHeader("Content-Type", "image/png");
    const parsedPath = pathSchema.parse(path);
    console.log(parsedPath.join("/"));
    const command = new GetObjectCommand({
      Bucket: "meetme-app",
      Key: parsedPath.join("/"),
    });

    const result = await s3Client.send(command);
    const imageBody = await result.Body?.transformToByteArray();
    if (!imageBody) {
      throw new Error("No Image found");
    }
    const buffer = Buffer.from(imageBody);
    res.status(200).send(buffer);
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "Not found" });
  }
};

const handler: NextApiHandler = async (req, res) => {
  const { method } = req;
  if (method === "GET") {
    // get handler
    return await getImageHandler(req, res);
  }

  return res.status(405).json({ message: "Method not allowed" });
};
export default handler;
