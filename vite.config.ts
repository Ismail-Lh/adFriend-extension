import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
	plugins: [react()],
	build: {
		// output all files to the `assets` directory so they can be referenced in manifest.json
		outDir: "dist",
		rollupOptions: {
			input: {
				// main content script entry point
				content: resolve(__dirname, "src/content.tsx"),
				options: resolve(__dirname, "src/options.tsx"),
			},
			output: {
				// Place built files in the assets directory for easier manifest reference.
				entryFileNames: "assets/[name].js",
				chunkFileNames: "assets/[name].js",
				assetFileNames: "assets/[name].[ext]",
			},
		},
	},
});
