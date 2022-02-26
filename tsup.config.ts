import { defineConfig } from "tsup";

export default defineConfig((options) => {
	return {
		entry: ["./src/index.ts"],
		target: "node16",
		splitting: false,
		format: ["esm"],
		platform: "node",

		// Development Hook
		onSuccess: options.watch ? "npm run start" : undefined
	};
});
