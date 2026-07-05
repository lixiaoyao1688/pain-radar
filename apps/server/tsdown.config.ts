import { defineConfig } from "tsdown";

export default defineConfig({
	entry: {
		index: "./src/index.ts",
		lambda: "./src/lambda.ts",
	},
	format: "esm",
	outDir: "./dist",
	clean: true,
	deps: {
		alwaysBundle: (id) => !id.startsWith("node:"),
		onlyBundle: false,
	},
});
