import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * Recursively walks a directory and yields absolute paths to files
 * whose names match the given extension filter.
 */
export function walk(dir: string, exts: string[] = [".js", ".ts"]): string[] {
	const results: string[] = [];
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);
		const stat = statSync(full);
		if (stat.isDirectory()) {
			results.push(...walk(full, exts));
		} else if (exts.some((ext) => entry.endsWith(ext)) && !entry.endsWith(".d.ts")) {
			results.push(full);
		}
	}
	return results;
}