import type { NextApiRequest, NextApiResponse } from "next";
import { kv } from "@vercel/kv";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<string[]>
) {
	const projects = await kv.get<string[]>("projects");
	res.status(200).json(projects ?? []);
}
