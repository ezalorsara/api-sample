import type { NextApiRequest, NextApiResponse } from "next";
import { kv } from "@vercel/kv";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<any>
) {
	const projectName =
		typeof req.query?.project === "string" ? req.query.project : "";
	const dates = await kv.get<string[]>(`${projectName}-date-list`);
	res.status(200).json(dates);
}
