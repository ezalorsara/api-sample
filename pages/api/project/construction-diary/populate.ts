import {
	getProjectAssets,
	getProjects,
	getProjectsDates,
} from "@/utils/constructionDiary";
import listBucketObjects from "@/utils/listBucketObjects";
import s3ClientData from "@/utils/s3Client";
import type { NextApiRequest, NextApiResponse } from "next";

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
	 * 2.) get all projects
	 */
	const projects: string[] = getProjects(paths);

	/**
	 * 3.) get all dates inside a specific project
	 */
	const projectDates = getProjectsDates(paths, projects);

	/**
	 * 4.) get all assets from specific project, year and month
	 */
	const projectAssets = await getProjectAssets(projectDates, paths);

	res.status(200).json({ message: JSON.stringify(projectAssets, null, 2) });
}
