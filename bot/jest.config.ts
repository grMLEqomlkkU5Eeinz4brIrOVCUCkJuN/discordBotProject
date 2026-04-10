import type { Config } from "jest";

const config: Config = {
	preset: "ts-jest/presets/default-esm",
	testEnvironment: "node",
	rootDir: "src",
	moduleFileExtensions: ["ts", "js", "json"],
	extensionsToTreatAsEsm: [".ts"],
	moduleNameMapper: {
		"^(\\.{1,2}/.*)\\.js$": "$1",
	},
	transform: {
		"^.+\\.ts$": [
			"ts-jest",
			{ useESM: true },
		],
	},
	testMatch: [
		"**/*.test.ts",
		"**/*.spec.ts",
	],
	collectCoverageFrom: [
		"**/*.ts",
		"!**/*.test.ts",
		"!**/*.spec.ts",
		"!**/types/**",
	],
	coverageDirectory: "../coverage",
};

export default config;