import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
	message: string;
};

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<ResponseData>
) {
	res
		.status(200)
		.json({ message: "list of assets under this project and specific date!" });
}
