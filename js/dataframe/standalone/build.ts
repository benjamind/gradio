import { execSync } from "child_process";
import {
	copyFileSync,
	mkdirSync,
	existsSync,
	readFileSync,
	writeFileSync
} from "fs";
import { join } from "path";

console.log("Building standalone dataframe component...");

interface Config {
	themeDir: string;
	sourceThemeDir: string;
	sharedDir: string;
	themeFiles: string[];
	sharedSubDirs: string[];
}

const CONFIG: Config = {
	themeDir: "./theme/src",
	sourceThemeDir: "../../theme/src",
	sharedDir: "./shared",
	themeFiles: ["reset.css", "pollen.css", "typography.css"],
	sharedSubDirs: ["utils", "context", "icons"]
};

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
		pattern: /from ["']js\/core\/src\/gradio_helper["']/g,
		replacement: 'from "../stubs"'
	},
	{ pattern: /from ["']js\/utils\/src["']/g, replacement: 'from "../stubs"' },
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
	const filename = filepath.split("/").pop() || "";
	const modifications = FILE_MODIFICATIONS[filename] || [];
	return apply_replacements(content, modifications);
}

function modifyImports(content: string, filepath: string): string {
	let modified = apply_replacements(content, IMPORT_REPLACEMENTS);
	modified = apply_file_specific_modifications(modified, filepath);

	return modified;
}

function setup_theme(): void {
	console.log("Generating theme CSS...");
	try {
		execSync(
			"python ../../../scripts/generate_theme.py --outfile ./theme.css",
			{
				cwd: process.cwd(),
				stdio: "inherit"
			}
		);
		console.log("✅ Theme CSS generated");
	} catch (error) {
		console.error(
			"❌ Failed to generate theme CSS:",
			error instanceof Error ? error.message : String(error)
		);
		process.exit(1);
	}

	console.log("Copying theme files...");
	if (!existsSync(CONFIG.themeDir)) {
		mkdirSync(CONFIG.themeDir, { recursive: true });
	}

	for (const file of CONFIG.themeFiles) {
		try {
			copyFileSync(
				join(CONFIG.sourceThemeDir, file),
				join(CONFIG.themeDir, file)
			);
			console.log(`✅ Copied ${file}`);
		} catch (error) {
			console.error(
				`❌ Failed to copy ${file}:`,
				error instanceof Error ? error.message : String(error)
			);
			process.exit(1);
		}
	}
}

function setup_shared_directory(): void {
	console.log("Copying shared files...");

	if (existsSync(CONFIG.sharedDir)) {
		execSync(`rm -rf ${CONFIG.sharedDir}`);
	}
	mkdirSync(CONFIG.sharedDir, { recursive: true });

	for (const subDir of CONFIG.sharedSubDirs) {
		mkdirSync(join(CONFIG.sharedDir, subDir), { recursive: true });
	}
}

function copy_and_modify_files(filesToCopy: string[]): void {
	for (const file of filesToCopy) {
		const srcPath = join("../shared", file);
		const destPath = join(CONFIG.sharedDir, file);

		try {
			if (existsSync(srcPath)) {
				const content = readFileSync(srcPath, "utf8");
				const modifiedContent = modifyImports(content, file);
				writeFileSync(destPath, modifiedContent);
				console.log(`✅ Copied and modified ${file}`);
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

function create_consolidated_css(): void {
	console.log("Creating consolidated CSS file...");
	try {
		const resetCSS = readFileSync(join(CONFIG.themeDir, "reset.css"), "utf8");
		const pollenCSS = readFileSync(join(CONFIG.themeDir, "pollen.css"), "utf8");
		const typographyCSS = readFileSync(
			join(CONFIG.themeDir, "typography.css"),
			"utf8"
		);
		const themeCSS = readFileSync("./theme.css", "utf8");

		const scopedResetCSS = resetCSS
			.replace(/\.gradio-container,\s*\*/g, ".gradio-dataframe-standalone *")
			.replace(/^(\s*)\*(\s*[,\{])/gm, "$1.gradio-dataframe-standalone *$2")
			.replace(
				/^(\s*)::before,(\s*)::after(\s*\{)/gm,
				"$1.gradio-dataframe-standalone *::before,$2.gradio-dataframe-standalone *::after$3"
			);

		const consolidatedCSS = `/* Gradio Dataframe Standalone - Consolidated CSS */

/* Scoped Reset Styles */
${scopedResetCSS}

/* Design Tokens */
${pollenCSS}

/* Typography */
${typographyCSS}

/* Theme Styles */
${themeCSS}

/* Component styles handled by Svelte's scoped CSS */
`;

		writeFileSync("./dataframe.css", consolidatedCSS);
		console.log("✅ Consolidated CSS file created: dataframe.css");
	} catch (error) {
		console.error(
			"❌ Failed to create consolidated CSS:",
			error instanceof Error ? error.message : String(error)
		);
		process.exit(1);
	}
}

setup_theme();
setup_shared_directory();

const files_to_copy = [
	"Table.svelte",
	"EditableCell.svelte",
	"RowNumber.svelte",
	"TableHeader.svelte",
	"TableCell.svelte",
	"EmptyRowButton.svelte",
	"VirtualTable.svelte",
	"BooleanCell.svelte",
	"CellMenu.svelte",
	"CellMenuButton.svelte",
	"CellMenuIcons.svelte",
	"FilterMenu.svelte",
	"Toolbar.svelte",
	"Example.svelte",
	"selection_utils.ts",
	"utils.ts",
	"icons/Padlock.svelte",
	"icons/SortArrowUp.svelte",
	"icons/SortArrowDown.svelte",
	"icons/SortButtonUp.svelte",
	"icons/SortButtonDown.svelte",
	"icons/SortIcon.svelte",
	"icons/FilterIcon.svelte",
	"icons/SelectionButtons.svelte",
	"utils/table_utils.ts",
	"utils/filter_utils.ts",
	"utils/sort_utils.ts",
	"utils/drag_utils.ts",
	"utils/keyboard_utils.ts",
	"utils/data_processing.ts",
	"utils/menu_utils.ts",
	"utils/index.ts",
	"context/dataframe_context.ts",
	"types.ts"
];

copy_and_modify_files(files_to_copy);
console.log("✅ Shared files copied and modified for standalone use");

function update_types_file(): void {
	try {
		const typesPath = "./types.d.ts";
		if (existsSync(typesPath)) {
			let content = readFileSync(typesPath, "utf8");

			content = content.replace(
				/@gradio\/dataframe-standalone/g,
				"@hmbgradio/dataframe-standalone"
			);

			writeFileSync(typesPath, content);
			console.log("✅ Updated types.d.ts with correct package name");
		} else {
			console.log("⚠️  types.d.ts not found, skipping update");
		}
	} catch (error) {
		console.error(
			"❌ Failed to update types.d.ts:",
			error instanceof Error ? error.message : String(error)
		);
	}
}

update_types_file();

function copy_react_wrapper(): void {
	try {
		const reactWrapperPath = "./DataframeReact.tsx";
		const reactTypesPath = "./react.d.ts";

		if (existsSync(reactWrapperPath)) {
			console.log("✅ React wrapper found: DataframeReact.tsx");
		} else {
			console.log("⚠️  React wrapper not found, skipping");
		}

		if (existsSync(reactTypesPath)) {
			console.log("✅ React types found: react.d.ts");
		} else {
			console.log("⚠️  React types not found, skipping");
		}
	} catch (error) {
		console.error(
			"❌ Failed to process React wrapper:",
			error instanceof Error ? error.message : String(error)
		);
	}
}

copy_react_wrapper();

create_consolidated_css();

console.log("✅ Standalone dataframe build complete!");
console.log("📝 Shared files have been copied and modified for standalone use");
console.log("📦 Package is ready for npm publishing");
console.log("🎯 Main entry point: Index.svelte");
