import { Assets, DateObject } from "@/types/constructionDiary";
import sortDate from "@/utils/sortConstructionDiaryDate";

export function getProjects(paths: string[]) {
	const projects: Record<string, string> = {};
	paths.forEach((path) => {
		const segment = path.split("/");
		if (segment.length === 0) {
			return;
		}

		const root = segment[0];
		projects[root] = "";
	});
	return Object.keys(projects);
}

export function getProjectsDates(paths: string[], projects: string[]) {
	const projectDatesRecord: Record<string, DateObject[]> = {};
	for (const project of projects) {
		const dateRecord: Record<string, DateObject> = {};
		for (const path of paths) {
			if (!path.includes(`${project}/`)) {
				continue;
			}

			const pathArray = path.split("/");
			if (pathArray.length <= 2) {
				continue;
			}

			const datePath = pathArray[2]; // datePath looks like 2023_05, 2023_05
			const datePathArr = datePath.split("_");

			try {
				const year = parseInt(datePathArr[0]);
				const month = parseInt(datePathArr[1]);
				if (Number.isNaN(year) || Number.isNaN(month)) {
					continue;
				}
			} catch (e) {
				continue;
			}

			const date = {
				year: datePathArr[0],
				month: datePathArr[1],
			};
			dateRecord[datePath] = date;
		}
		const datesObject: DateObject[] = [];
		Object.keys(dateRecord).forEach((key) => {
			datesObject.push(dateRecord[key]);
		});
		projectDatesRecord[project] = sortDate(datesObject, "desc");
	}
	return projectDatesRecord;
}

export async function getProjectAssets(
	projectsDate: ReturnType<typeof getProjectsDates>,
	paths: string[]
) {
	const assetsUrl = process.env?.MEDIA_BASE_URL ?? "";
	const projectDatesRecords: Record<string, Assets> = {};
	let pathsCopy = [...paths];

	for (const project of Object.keys(projectsDate)) {
		for (const dateObject of projectsDate[project]) {
			// Initialize defualt value
			projectDatesRecords[`${project}/${dateObject.year}_${dateObject.month}`] =
				{
					images: [],
					videos: [],
				};

			/**
			 * Get all images for project and specific date
			 */
			const imageKey = `${project}/images/${dateObject.year}_${dateObject.month}`;
			let removeIndexes: number[] = [];
			let imgCounter = 0;
			for (const path of pathsCopy) {
				if (path.includes(imageKey)) {
					removeIndexes.push(imgCounter);

					const pathArray = path.split("/");
					if (pathArray[pathArray.length - 1] === "") {
						continue;
					}

					// get image dimension
					const src = `${assetsUrl}/${path}`;
					// const dimension = await getImageDimension(bucketName, path);
					const dimension = { width: 0, height: 0 };
					projectDatesRecords[
						`${project}/${dateObject.year}_${dateObject.month}`
					].images.push({
						src,
						fileName: path.split("/")[path.split("/").length - 1],
						width: dimension?.width ? dimension.width : 0,
						height: dimension?.height ? dimension.height : 0,
					});
				}

				imgCounter++;
			}
			pathsCopy = pathsCopy.filter(
				(_, index) => !removeIndexes.includes(index)
			);

			/**
			 * Get Video
			 */
			const videoKey = `${project}/videos/${dateObject.year}_${dateObject.month}`;
			removeIndexes = [];
			let vidCounter = 0;
			for (const path of pathsCopy) {
				if (path.includes(videoKey)) {
					removeIndexes.push(vidCounter);

					const pathArray = path.split("/");
					if (pathArray[pathArray.length - 1] === "") {
						continue;
					}

					const src = `${assetsUrl}/${path}`;
					projectDatesRecords[
						`${project}/${dateObject.year}_${dateObject.month}`
					].videos.push({
						src,
					});
				}
				vidCounter++;
			}

			pathsCopy = pathsCopy.filter(
				(_, index) => !removeIndexes.includes(index)
			);
		}
	}

	return projectDatesRecords;
}
