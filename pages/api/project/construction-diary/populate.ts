import {
	getProjectAssets,
	getProjects,
	getProjectsDates,
} from "@/utils/constructionDiary";
import listBucketObjects from "@/utils/listBucketObjects";
import s3ClientData from "@/utils/s3Client";
import type { NextApiRequest, NextApiResponse } from "next";
import { kv } from "@vercel/kv";
import * as fs from "fs";

type ResponseData = {
	message: string;
};

const s3Client = s3ClientData();

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ResponseData>
) {
	/**
	 * 1.) get all paths
	 */
	const paths = await listBucketObjects(
		"dfk-group-media-assets-prod",
		s3Client
	);

	/**
	 * 2.) get all projects and store to kv
	 */
	const projects: string[] = getProjects(paths);
	await kv.set("projects", projects);

	/**
	 * 3.) get all dates inside a specific project and store to kv
	 */
	const projectDates = getProjectsDates(paths, projects);
	for (const project of Object.keys(projectDates)) {
		await kv.set(`${project}-date-list`, projectDates[project]);
	}

	/**
	 * 4.) get all assets from specific project, year and month, then store to kv
	 */
	const projectAssets = await getProjectAssets(projectDates, paths);
	for (const projectAndDate of Object.keys(projectAssets)) {
		try {
			await kv.set(projectAndDate, projectAssets[projectAndDate]);
		} catch (e) {
			console.info("projectAndDate: ", projectAndDate);
			console.error(e);
		}
	}

	try {
		fs.writeFileSync("test.txt", JSON.stringify(projectAssets, null, 2));
		console.log("File written successfully");
	} catch (err) {
		console.error(err);
	}

	res.status(200).json({ message: "successfully sync s3 data to kv store" });
}
