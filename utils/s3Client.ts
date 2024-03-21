import { S3Client } from "@aws-sdk/client-s3";

const s3ClientData = (): S3Client => {
	const accessKeyId = process.env.AWS_ACCESS_KEY;
	const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
	const bucketRegion = process.env.AWS_BUCKET_REGION;
	const sessionToken = process.env.AWS_SESSION_TOKEN;
	if (!accessKeyId || !secretAccessKey || !bucketRegion) {
		throw new Error("Missing AWS Credentials");
	}

	const client = new S3Client({
		region: bucketRegion,
		credentials: { accessKeyId, secretAccessKey, sessionToken },
	});

	return client;
};

export default s3ClientData;
