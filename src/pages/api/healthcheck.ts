import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "~/server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    await db.user.findFirst();

    res.status(200).json({ status: "ok" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ status: "error" });
  }
}
