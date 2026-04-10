import { Type, type Static } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import "dotenv/config";

const envSchema = Type.Object({
	DISCORD_TOKEN: Type.String({ minLength: 1 }),
	DISCORD_CLIENT_ID: Type.String({ minLength: 1 }),
	NODE_ENV: Type.Union([
		Type.Literal("development"),
		Type.Literal("production"),
		Type.Literal("test"),
	], { default: "development" }),
	LOG_LEVEL: Type.Union([
		Type.Literal("error"),
		Type.Literal("warn"),
		Type.Literal("info"),
		Type.Literal("debug"),
	], { default: "info" }),
	SERVICE_NAME: Type.String({ default: "mipanmachine-bot" }),
	MAX_LOG_SIZE: Type.String({ default: "20m" }),
	MAX_LOG_FILES: Type.String({ default: "14d" }),
	COMPRESS_LOGS: Type.Boolean({ default: true }),
});

type Env = Static<typeof envSchema>;

const withDefaults = Value.Default(envSchema, { ...process.env }) as Record<string, unknown>;
const parsed = Value.Decode(envSchema, withDefaults);

export const env: Env = parsed;