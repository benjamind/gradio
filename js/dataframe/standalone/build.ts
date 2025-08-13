import {
	mkdirSync,
	existsSync,
	readFileSync,
	writeFileSync,
	rmSync,
	readdirSync,
	statSync
} from "fs";
import { join, dirname } from "path";

console.log("Building standalone dataframe component...");

const SHARED_DIR = "./shared";

interface ImportReplacement {
	pattern: RegExp;
	replacement: string;
}

const IMPORT_REPLACEMENTS: ImportReplacement[] = [
	{ pattern: /from ["']@gradio\/upload["']/g, replacement: 'from "../stubs"' },
	{
		pattern: /from ["']@gradio\/checkbox["']/g,
		replacement: 'from "../stubs"'
	},
	{ pattern: /from ["']@gradio\/atoms["']/g, replacement: 'from "../stubs"' },
	{
		pattern: /from ["']@gradio\/markdown-code["']/g,
		replacement: 'from "../stubs"'
	},
	{ pattern: /from ["']@gradio\/utils["']/g, replacement: 'from "../stubs"' },
	{ pattern: /from ["']@gradio\/client["']/g, replacement: 'from "../stubs"' },
	{ pattern: /from ["']svelte-i18n["']/g, replacement: 'from "../stubs"' },
	{
		pattern: /from ["'][^"']*DropdownArrow\.svelte["']/g,
		replacement: 'from "../stubs"'
	}
];

interface FileModification {
	pattern: RegExp;
	replacement: string;
}

interface FileModifications {
	[key: string]: FileModification[];
}

const FILE_MODIFICATIONS: FileModifications = {
	"Table.svelte": [
		{
			pattern: /import \{ Upload \} from ["']@gradio\/upload["'];/g,
			replacement: 'import Upload from "../stubs/Upload.svelte";'
		}
	]
};

function apply_replacements(
	content: string,
	replacements: ImportReplacement[]
): string {
	return replacements.reduce((modified, { pattern, replacement }) => {
		return modified.replace(pattern, replacement);
	}, content);
}

function apply_file_specific_modifications(
	content: string,
	filepath: string
): string {
	const modifications =
		FILE_MODIFICATIONS[filepath] ||
		FILE_MODIFICATIONS[filepath.split("/").pop() || ""] ||
		[];
	return modifications.reduce((modified, { pattern, replacement }) => {
		return modified.replace(pattern, replacement);
	}, content);
}

function modifyImports(content: string, filepath: string): string {
	let modified = apply_replacements(content, IMPORT_REPLACEMENTS);
	modified = apply_file_specific_modifications(modified, filepath);

	return modified;
}

function ensure_css(): void {
	if (!existsSync("./dataframe.css")) {
		writeFileSync("./dataframe.css", "/* Placeholder for dataframe.css. */\n");
	}
}

function setup_shared_directory(): void {
	console.log("Copying shared files...");

	if (existsSync(SHARED_DIR)) {
		rmSync(SHARED_DIR, { recursive: true, force: true });
	}
	mkdirSync(SHARED_DIR, { recursive: true });
}

function copy_and_modify_files(filesToCopy: string[]): void {
	for (const file of filesToCopy) {
		const srcPath = join("../shared", file);
		const destPath = join(SHARED_DIR, file);

		try {
			if (existsSync(srcPath)) {
				const content = readFileSync(srcPath, "utf8");
				const modifiedContent = modifyImports(content, file);
				const destDir = dirname(destPath);
				if (!existsSync(destDir)) {
					mkdirSync(destDir, { recursive: true });
				}
				writeFileSync(destPath, modifiedContent);
			} else {
				console.log(`⚠️  Skipped ${file} (doesn't exist)`);
			}
		} catch (error) {
			console.error(
				`❌ Failed to copy ${file}:`,
				error instanceof Error ? error.message : String(error)
			);
		}
	}
}

function collect_shared_files(): string[] {
	const root = join("../shared");
	const includeExts = new Set([".svelte", ".ts"]);
	const excludePatterns = [/\.test\./, /\.stories\./, /\.spec\./];

	function walk(dir: string, relBase: string = ""): string[] {
		let results: string[] = [];
		for (const entry of readdirSync(dir)) {
			const abs = join(dir, entry);
			const rel = relBase ? join(relBase, entry) : entry;
			const st = statSync(abs);
			if (st.isDirectory()) {
				results = results.concat(walk(abs, rel));
				continue;
			}
			if (excludePatterns.some((rx) => rx.test(entry))) continue;
			const dot = entry.lastIndexOf(".");
			const ext = dot >= 0 ? entry.slice(dot) : "";
			if (includeExts.has(ext)) {
				results.push(rel);
			}
		}
		return results;
	}

	return walk(root).sort();
}

// Main execution
ensure_css();
setup_shared_directory();

const files_to_copy = collect_shared_files();
copy_and_modify_files(files_to_copy);
console.log("✅ Standalone dataframe build complete");
