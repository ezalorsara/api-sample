import { DateObject } from "@/types/constructionDiary";

function sortDate(dates: DateObject[], order: "asc" | "desc" = "asc") {
	return dates.sort((a, b) => {
		// Convert year and month to numbers for comparison
		const yearA = Number(a.year);
		const monthA = Number(a.month);
		const yearB = Number(b.year);
		const monthB = Number(b.month);

		// Compare years first
		if (yearA !== yearB) {
			return order === "asc" ? yearA - yearB : yearB - yearA; // Descending order of years
		}

		// If years are equal, compare months
		return order === "asc" ? monthA - monthB : monthB - monthA; // Descending order of months
	});
}

export default sortDate;
