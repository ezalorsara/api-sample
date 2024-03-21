export type DateObject = {
	year: string;
	month: string;
};

export type Assets = {
	videos: { src: string }[];
	images: { src: string; width: number; height: number; fileName: string }[];
};
