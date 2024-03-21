import removeEmptyArrayItems from "@/utils/removeEmptyArrayItems";
import s3ClientData from "@/utils/s3Client";
import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";

async function listBucketObjects(bucketName: string, s3Client: S3Client) {
	const command = new ListObjectsV2Command({ Bucket: bucketName });
	let isTruncated = true;
	let continuationToken;
	let allObjects: string[] = [];

	while (isTruncated) {
		const response = await s3Client.send(command);
		if (!response?.Contents) {
			break;
		}
		const keys = response.Contents.map((item) => item.Key);
		allObjects = allObjects.concat(
			response.Contents.map((item) => item.Key).filter(removeEmptyArrayItems)
		);
		isTruncated = !!response?.IsTruncated;
		continuationToken = response.NextContinuationToken;
		command.input.ContinuationToken = continuationToken;
	}

	return allObjects;
}

export default listBucketObjects;
