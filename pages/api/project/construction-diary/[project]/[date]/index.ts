import type { NextApiRequest, NextApiResponse } from "next";
import { kv } from "@vercel/kv";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<any>
) {
	const projectNameParam =
		typeof req.query?.project === "string" ? req.query.project : "";
	const dateParam =
		typeof req.query?.project === "string" ? req.query.date : "";

	const assets = await kv.get<string[]>(`${projectNameParam}/${dateParam}`);
	res.status(200).json(assets);
}
